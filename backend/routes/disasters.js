const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const Disaster = require('../models/Disaster');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/disasters
// @desc    Get all disasters with filtering
// @access  Private
router.get('/', protect, [
  query('status').optional().isIn(['pending', 'accepted', 'declined', 'resolved']),
  query('type').optional().isIn(['flood', 'earthquake', 'fire', 'hurricane', 'other']),
  query('severity').optional().isIn(['low', 'medium', 'high', 'critical']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { status, type, severity } = req.query;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (severity) where.severity = severity;

    if (req.user.role === 'user') {
      where.reportedById = req.user.id;
    } else if (req.user.role === 'volunteer') {
      where[Op.or] = [
        { status: 'pending' },
        { assignedToId: req.user.id }
      ];
    }

    const { rows: disasters, count: total } = await Disaster.findAndCountAll({
      where,
      include: [
        { model: User, as: 'reportedBy', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({ success: true, count: disasters.length, total, page, pages: Math.ceil(total / limit), disasters });
  } catch (error) {
    console.error('Get disasters error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/disasters/nearby
// @desc    Get disasters near a location (simple bounding box approximation)
// @access  Private
router.get('/nearby', protect, [
  query('lat').isFloat({ min: -90, max: 90 }),
  query('lng').isFloat({ min: -180, max: 180 }),
  query('distance').optional().isInt({ min: 1000, max: 50000 })
], async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const distance = parseInt(req.query.distance || '10000', 10); // meters

    // Approx: 1 degree ~ 111km
    const deg = distance / 1000 / 111;
    const where = {
      location_lat: { [Op.between]: [lat - deg, lat + deg] },
      location_lng: { [Op.between]: [lng - deg, lng + deg] }
    };

    const disasters = await Disaster.findAll({
      where,
      include: [
        { model: User, as: 'reportedBy', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, count: disasters.length, disasters });
  } catch (error) {
    console.error('Get nearby disasters error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/disasters/:id
// @desc    Get single disaster
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const disaster = await Disaster.findByPk(req.params.id, {
      include: [
        { model: User, as: 'reportedBy', attributes: ['id', 'name', 'email', 'phone'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email', 'phone', 'skills'] }
      ]
    });

    if (!disaster) return res.status(404).json({ message: 'Disaster not found' });
    res.json({ success: true, disaster });
  } catch (error) {
    console.error('Get disaster error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/disasters
// @desc    Create new disaster
// @access  Private
router.post('/', protect, uploadMultiple, handleUploadError, [
  body('title').trim().isLength({ min: 5, max: 100 }),
  body('description').trim().isLength({ min: 10, max: 1000 }),
  body('type').isIn(['flood', 'earthquake', 'fire', 'hurricane', 'other']),
  body('severity').isIn(['low', 'medium', 'high', 'critical']),
  body('location.address').trim().notEmpty(),
  body('location.coordinates.lat').isFloat({ min: -90, max: 90 }),
  body('location.coordinates.lng').isFloat({ min: -180, max: 180 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

    const images = req.files ? req.files.map(f => f.path) : [];
    const { title, description, type, severity, location } = req.body;

    const disaster = await Disaster.create({
      title,
      description,
      type,
      severity,
      location_address: location.address,
      location_lat: location.coordinates.lat,
      location_lng: location.coordinates.lng,
      images,
      reportedById: req.user.id
    });

    // Notify volunteers and admins
    const volunteers = await User.findAll({ where: { role: 'volunteer', isActive: true } });
    const admins = await User.findAll({ where: { role: 'admin', isActive: true } });
    const notifyUsers = [...volunteers, ...admins];

    for (const u of notifyUsers) {
      await Notification.create({
        recipientId: u.id,
        title: 'New Disaster Reported',
        message: `A new ${disaster.type} disaster has been reported: ${disaster.title}`,
        type: 'disaster_alert',
        relatedDisasterId: disaster.id
      });
      const io = req.app.get('io');
      if (io) io.to(`user-${u.id}`).emit('notification', { title: 'New Disaster Reported', message: `A new ${disaster.type} disaster has been reported: ${disaster.title}`, type: 'disaster_alert', relatedDisaster: disaster.id });
    }

    res.status(201).json({ success: true, disaster });
  } catch (error) {
    console.error('Create disaster error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/disasters/:id/status
// @desc    Update disaster status
// @access  Private
router.put('/:id/status', protect, [
  body('status').isIn(['pending', 'accepted', 'declined', 'resolved']),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

    const { status, notes } = req.body;
    const disaster = await Disaster.findByPk(req.params.id);
    if (!disaster) return res.status(404).json({ message: 'Disaster not found' });

    if (req.user.role === 'user' && disaster.reportedById !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this disaster' });
    }

    disaster.status = status;
    if (status === 'accepted' && req.user.role === 'volunteer') {
      disaster.assignedToId = req.user.id;
    }
    if (notes) {
      const currentNotes = Array.isArray(disaster.notes) ? disaster.notes : [];
      currentNotes.push({ content: notes, addedBy: req.user.id, addedAt: new Date() });
      disaster.notes = currentNotes;
    }
    await disaster.save();

    await Notification.create({
      recipientId: disaster.reportedById,
      title: 'Disaster Status Updated',
      message: `Your disaster "${disaster.title}" status has been updated to ${status}`,
      type: 'status_update',
      relatedDisasterId: disaster.id
    });
    const io = req.app.get('io');
    if (io) io.to(`user-${disaster.reportedById}`).emit('notification', { title: 'Disaster Status Updated', message: `Your disaster "${disaster.title}" status has been updated to ${status}`, type: 'status_update', relatedDisaster: disaster.id });

    res.json({ success: true, disaster });
  } catch (error) {
    console.error('Update disaster status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/disasters/:id
// @desc    Update disaster details
// @access  Private
router.put('/:id', protect, [
  body('title').optional().trim().isLength({ min: 5, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }),
  body('severity').optional().isIn(['low', 'medium', 'high', 'critical'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

    const disaster = await Disaster.findByPk(req.params.id);
    if (!disaster) return res.status(404).json({ message: 'Disaster not found' });

    if (req.user.role !== 'admin' && disaster.reportedById !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this disaster' });
    }

    await disaster.update(req.body);

    const updated = await Disaster.findByPk(req.params.id, {
      include: [
        { model: User, as: 'reportedBy', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json({ success: true, disaster: updated });
  } catch (error) {
    console.error('Update disaster error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/disasters/:id
// @desc    Delete disaster
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const disaster = await Disaster.findByPk(req.params.id);
    if (!disaster) return res.status(404).json({ message: 'Disaster not found' });

    await disaster.destroy();
    res.json({ success: true, message: 'Disaster deleted successfully' });
  } catch (error) {
    console.error('Delete disaster error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 