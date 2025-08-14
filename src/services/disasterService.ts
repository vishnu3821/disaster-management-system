import { Disaster } from '../contexts/DisasterContext';

// Use production Railway URL or fallback to localhost for development
const API_BASE = (import.meta.env.VITE_API_URL as string) || 
  (import.meta.env.PROD ? 'https://web-production-50cb.up.railway.app/api' : 'http://localhost:5001/api');

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toClientDisaster = (raw: any): Disaster => ({
  id: String(raw.id),
  title: raw.title,
  description: raw.description,
  type: raw.type,
  severity: raw.severity,
  location: {
    address: raw.location_address,
    coordinates: { lat: raw.location_lat, lng: raw.location_lng }
  },
  status: raw.status,
  reportedBy: raw.reportedBy ? { id: String(raw.reportedBy.id), name: raw.reportedBy.name } : { id: '', name: '' },
  assignedTo: raw.assignedTo ? { id: String(raw.assignedTo.id), name: raw.assignedTo.name } : undefined,
  reportedAt: new Date(raw.createdAt),
  updatedAt: new Date(raw.updatedAt),
  images: raw.images || []
});

// Get all disasters
export const getDisasters = async (): Promise<Disaster[]> => {
  const res = await fetch(`${API_BASE}/disasters`, { headers: { ...getAuthHeaders() } });
  if (!res.ok) throw new Error('Failed to fetch disasters');
  const data = await res.json();
  return (data.disasters || []).map(toClientDisaster);
};

// Get a single disaster by ID
export const getDisasterById = async (id: string): Promise<Disaster> => {
  const res = await fetch(`${API_BASE}/disasters/${id}`, { headers: { ...getAuthHeaders() } });
  if (!res.ok) throw new Error('Disaster not found');
  const data = await res.json();
  return toClientDisaster(data.disaster);
};

// Create a new disaster
export const createDisaster = async (
  disasterData: Omit<Disaster, 'id' | 'status' | 'reportedAt' | 'updatedAt'>
): Promise<Disaster> => {
  const payload = {
    title: disasterData.title,
    description: disasterData.description,
    type: disasterData.type,
    severity: disasterData.severity,
    location: {
      address: disasterData.location.address,
      coordinates: {
        lat: disasterData.location.coordinates.lat,
        lng: disasterData.location.coordinates.lng
      }
    }
  };
  const res = await fetch(`${API_BASE}/disasters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create disaster');
  }
  const data = await res.json();
  return toClientDisaster(data.disaster);
};

// Update disaster status
export const updateDisasterStatus = async (
  id: string,
  newStatus: Disaster['status'],
  _volunteerId?: string
): Promise<Disaster> => {
  const res = await fetch(`${API_BASE}/disasters/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ status: newStatus })
  });
  if (!res.ok) throw new Error('Failed to update disaster status');
  const data = await res.json();
  return toClientDisaster(data.disaster);
};