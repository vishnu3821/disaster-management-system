import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getDisasters, 
  getDisasterById, 
  createDisaster, 
  updateDisasterStatus 
} from '../services/disasterService';
import { useAuth } from './AuthContext';

export interface Disaster {
  id: string;
  title: string;
  description: string;
  type: 'flood' | 'earthquake' | 'fire' | 'hurricane' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  };
  status: 'pending' | 'accepted' | 'declined' | 'resolved';
  reportedBy: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  reportedAt: Date;
  updatedAt: Date;
  images?: string[];
}

interface DisasterContextType {
  disasters: Disaster[];
  userDisasters: Disaster[];
  volunteerDisasters: Disaster[];
  isLoading: boolean;
  error: string | null;
  createNewDisaster: (disasterData: Omit<Disaster, 'id' | 'status' | 'reportedBy' | 'reportedAt' | 'updatedAt'>) => Promise<Disaster>;
  updateStatus: (disasterId: string, newStatus: Disaster['status'], volunteerId?: string) => Promise<void>;
  getDisaster: (id: string) => Promise<Disaster | undefined>;
  refreshDisasters: () => Promise<void>;
}

const DisasterContext = createContext<DisasterContextType | undefined>(undefined);

export const DisasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const userDisasters = user?.role === 'user' 
    ? disasters.filter(d => d.reportedBy.id === user.id)
    : [];
    
  const volunteerDisasters = user?.role === 'volunteer'
    ? disasters.filter(d => 
        d.status === 'pending' || 
        (d.assignedTo && d.assignedTo.id === user.id)
      )
    : [];

  const fetchDisasters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDisasters();
      setDisasters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch disasters');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasters();
  }, []);

  const createNewDisaster = async (disasterData: Omit<Disaster, 'id' | 'status' | 'reportedBy' | 'reportedAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) throw new Error('You must be logged in to report a disaster');
      
      const newDisaster = await createDisaster({
        ...disasterData,
        reportedBy: {
          id: user.id,
          name: user.name
        }
      });
      
      setDisasters(prevDisasters => [...prevDisasters, newDisaster]);
      return newDisaster;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create disaster report');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (disasterId: string, newStatus: Disaster['status'], volunteerId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) throw new Error('You must be logged in to update disaster status');
      
      const updatedDisaster = await updateDisasterStatus(disasterId, newStatus, volunteerId);
      
      setDisasters(prevDisasters => 
        prevDisasters.map(disaster => 
          disaster.id === disasterId ? updatedDisaster : disaster
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update disaster status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getDisaster = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // First check if we already have it
      const existingDisaster = disasters.find(d => d.id === id);
      if (existingDisaster) {
        setIsLoading(false);
        return existingDisaster;
      }
      
      // Otherwise fetch it
      const disaster = await getDisasterById(id);
      return disaster;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch disaster details');
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDisasters = async () => {
    return fetchDisasters();
  };

  return (
    <DisasterContext.Provider value={{ 
      disasters, 
      userDisasters,
      volunteerDisasters,
      isLoading, 
      error, 
      createNewDisaster, 
      updateStatus,
      getDisaster,
      refreshDisasters
    }}>
      {children}
    </DisasterContext.Provider>
  );
};

export const useDisasters = () => {
  const context = useContext(DisasterContext);
  if (context === undefined) {
    throw new Error('useDisasters must be used within a DisasterProvider');
  }
  return context;
};