import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  MessageSquare,
  CheckSquare,
  Phone,
  Share2,
  Flag,
  Map as MapIcon
} from 'lucide-react';
import { useDisasters, Disaster } from '../../contexts/DisasterContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import Button from '../../components/common/Button';
import { showAlert } from '../../components/common/AlertMessage';
import { formatRelativeTime } from '../../utils/dateUtils';

const DisasterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDisaster, updateStatus } = useDisasters();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [disaster, setDisaster] = useState<Disaster | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const fetchDisaster = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await getDisaster(id);
        if (data) {
          setDisaster(data);
        } else {
          showAlert({
            message: 'Disaster report not found',
            type: 'error'
          });
          navigate(-1);
        }
      } catch (error) {
        showAlert({
          message: 'Error loading disaster report',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisaster();
  }, [id, getDisaster, navigate]);

  const handleAccept = async () => {
    if (!disaster || !user) return;
    
    setIsActionLoading(true);
    try {
      await updateStatus(disaster.id, 'accepted', user.id);
      setDisaster({
        ...disaster,
        status: 'accepted',
        assignedTo: {
          id: user.id,
          name: user.name
        }
      });
      
      addNotification({
        message: 'You have accepted a disaster report. Please coordinate help immediately.',
        type: 'success',
        relatedTo: {
          type: 'disaster',
          id: disaster.id
        }
      });
      
      showAlert({
        message: 'Disaster accepted. Thank you for volunteering!',
        type: 'success'
      });
    } catch (error) {
      showAlert({
        message: 'Failed to accept the disaster. Please try again.',
        type: 'error'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!disaster) return;
    
    setIsActionLoading(true);
    try {
      await updateStatus(disaster.id, 'declined');
      setDisaster({
        ...disaster,
        status: 'declined'
      });
      
      showAlert({
        message: 'Disaster declined',
        type: 'info'
      });
    } catch (error) {
      showAlert({
        message: 'Failed to decline the disaster. Please try again.',
        type: 'error'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!disaster) return;
    
    setIsActionLoading(true);
    try {
      await updateStatus(disaster.id, 'resolved');
      setDisaster({
        ...disaster,
        status: 'resolved'
      });
      
      addNotification({
        message: 'You have marked a disaster as resolved. Thank you for your help!',
        type: 'success',
        relatedTo: {
          type: 'disaster',
          id: disaster.id
        }
      });
      
      showAlert({
        message: 'Disaster marked as resolved. Thank you for your service!',
        type: 'success'
      });
    } catch (error) {
      showAlert({
        message: 'Failed to resolve the disaster. Please try again.',
        type: 'error'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!disaster) return null;
    
    switch (disaster.status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center"><Clock size={16} className="mr-2" /> Pending Response</span>;
      case 'accepted':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"><CheckCircle size={16} className="mr-2" /> Volunteer Assigned</span>;
      case 'declined':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center"><XCircle size={16} className="mr-2" /> Response Declined</span>;
      case 'resolved':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"><CheckSquare size={16} className="mr-2" /> Resolved</span>;
      default:
        return null;
    }
  };

  const getSeverityBadge = () => {
    if (!disaster) return null;
    
    switch (disaster.severity) {
      case 'low':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Low Severity</span>;
      case 'medium':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Medium Severity</span>;
      case 'high':
        return <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">High Severity</span>;
      case 'critical':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Critical Severity</span>;
      default:
        return null;
    }
  };

  const getDisasterTypeBadge = () => {
    if (!disaster) return null;
    
    const bgColors = {
      flood: 'bg-blue-100 text-blue-800',
      earthquake: 'bg-purple-100 text-purple-800',
      fire: 'bg-red-100 text-red-800',
      hurricane: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`${bgColors[disaster.type]} px-3 py-1 rounded-full text-sm capitalize`}>
        {disaster.type}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!disaster) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Disaster Report Not Found</h1>
        <p className="text-gray-600 mb-6">
          The disaster report you're looking for doesn't exist or has been removed.
        </p>
        <Button 
          onClick={() => navigate(-1)}
          icon={<ArrowLeft size={18} />}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const isUserReporter = user?.id === disaster.reportedBy.id;
  const isUserVolunteer = user?.role === 'volunteer';
  const isAssignedToUser = isUserVolunteer && disaster.assignedTo && disaster.assignedTo.id === user.id;
  const canAcceptOrDecline = isUserVolunteer && disaster.status === 'pending';
  const canResolve = isUserVolunteer && disaster.status === 'accepted' && isAssignedToUser;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-red-600 mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          <span>Back</span>
        </button>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Disaster Header */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">{disaster.title}</h1>
              <div className="flex flex-wrap gap-2">
                {getStatusBadge()}
                {getSeverityBadge()}
                {getDisasterTypeBadge()}
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 mb-4">
              <Clock size={18} className="mr-2" />
              <span>Reported {formatRelativeTime(new Date(disaster.reportedAt))}</span>
              {disaster.updatedAt !== disaster.reportedAt && (
                <span className="ml-2">
                  • Updated {formatRelativeTime(new Date(disaster.updatedAt))}
                </span>
              )}
            </div>
            
            <div className="flex items-start text-gray-600 mb-2">
              <MapPin size={20} className="mr-2 flex-shrink-0 mt-1" />
              <span>{disaster.location.address}</span>
            </div>
          </div>
          
          {/* Disaster Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {disaster.description}
              </p>
              
              {disaster.images && disaster.images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-3">Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {disaster.images.map((image, index) => (
                      <div key={index} className="rounded-md overflow-hidden h-32 bg-gray-100">
                        <img 
                          src={image} 
                          alt={`Disaster image ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-md font-semibold mb-3">Activity Timeline</h3>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="bg-blue-100 rounded-full p-2">
                        <AlertTriangle size={16} className="text-blue-600" />
                      </div>
                      <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Disaster Reported</p>
                      <p className="text-xs text-gray-500">{new Date(disaster.reportedAt).toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {disaster.reportedBy.name} reported this disaster
                      </p>
                    </div>
                  </div>
                  
                  {disaster.status !== 'pending' && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`rounded-full p-2 ${
                          disaster.status === 'accepted' ? 'bg-green-100' : 
                          disaster.status === 'declined' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {disaster.status === 'accepted' ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <XCircle size={16} className="text-red-600" />
                          )}
                        </div>
                        {disaster.status === 'resolved' && (
                          <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {disaster.status === 'accepted' ? 'Volunteer Accepted' : 'Response Declined'}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(disaster.updatedAt).toLocaleString()}</p>
                        {disaster.status === 'accepted' && disaster.assignedTo && (
                          <p className="text-sm text-gray-600 mt-1">
                            {disaster.assignedTo.name} accepted this request
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {disaster.status === 'resolved' && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="bg-green-100 rounded-full p-2">
                          <CheckSquare size={16} className="text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Disaster Resolved</p>
                        <p className="text-xs text-gray-500">{new Date(disaster.updatedAt).toLocaleString()}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          This disaster has been successfully resolved
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-semibold mb-3">Reported By</h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{disaster.reportedBy.name}</p>
                    <button className="text-sm text-blue-600 flex items-center">
                      <Phone size={14} className="mr-1" />
                      Contact Reporter
                    </button>
                  </div>
                </div>
              </div>
              
              {disaster.status === 'accepted' && disaster.assignedTo && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-md font-semibold mb-3">Volunteer Assigned</h3>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{disaster.assignedTo.name}</p>
                      <p className="text-sm text-gray-600">Volunteer</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-semibold mb-3">Location</h3>
                <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <MapIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">{disaster.location.address}</p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  icon={<Share2 size={16} />}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showAlert({
                      message: 'Link copied to clipboard',
                      type: 'success'
                    });
                  }}
                >
                  Share
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  icon={<MessageSquare size={16} />}
                >
                  Send Message
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  icon={<Flag size={16} />}
                >
                  Report Issue
                </Button>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          {(canAcceptOrDecline || canResolve) && (
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex flex-col sm:flex-row gap-3">
                {canAcceptOrDecline && (
                  <>
                    <Button
                      variant="success"
                      icon={<CheckCircle size={18} />}
                      isLoading={isActionLoading}
                      onClick={handleAccept}
                      fullWidth
                    >
                      Accept & Respond
                    </Button>
                    <Button
                      variant="danger"
                      icon={<XCircle size={18} />}
                      isLoading={isActionLoading}
                      onClick={handleDecline}
                      fullWidth
                    >
                      Decline
                    </Button>
                  </>
                )}
                
                {canResolve && (
                  <Button
                    variant="success"
                    icon={<CheckSquare size={18} />}
                    isLoading={isActionLoading}
                    onClick={handleResolve}
                    fullWidth
                  >
                    Mark as Resolved
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisasterDetails;