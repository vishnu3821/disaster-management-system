import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  MapPin,
  User,
  MessageSquare,
  CheckSquare
} from 'lucide-react';
import { Disaster } from '../../contexts/DisasterContext';
import Button from '../common/Button';
import { formatRelativeTime } from '../../utils/dateUtils';

interface DisasterCardProps {
  disaster: Disaster;
  isVolunteer?: boolean;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onResolve?: (id: string) => void;
}

const DisasterCard: React.FC<DisasterCardProps> = ({ 
  disaster, 
  isVolunteer = false,
  onAccept,
  onDecline,
  onResolve
}) => {
  const getStatusBadge = () => {
    switch (disaster.status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center"><Clock size={14} className="mr-1" /> Pending</span>;
      case 'accepted':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"><CheckCircle size={14} className="mr-1" /> Accepted</span>;
      case 'declined':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center"><XCircle size={14} className="mr-1" /> Declined</span>;
      case 'resolved':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center"><CheckSquare size={14} className="mr-1" /> Resolved</span>;
      default:
        return null;
    }
  };

  const getSeverityBadge = () => {
    switch (disaster.severity) {
      case 'low':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Low</span>;
      case 'medium':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Medium</span>;
      case 'high':
        return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">High</span>;
      case 'critical':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Critical</span>;
      default:
        return null;
    }
  };

  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAccept) onAccept(disaster.id);
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDecline) onDecline(disaster.id);
  };

  const handleResolve = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onResolve) onResolve(disaster.id);
  };

  return (
    <Link to={`/disaster/${disaster.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Card Header */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{disaster.title}</h3>
            <div className="flex items-center space-x-2">
              {getStatusBadge()}
              {getSeverityBadge()}
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            Reported {formatRelativeTime(new Date(disaster.reportedAt))}
          </p>
        </div>
        
        {/* Card Body */}
        <div className="p-4">
          <div className="flex items-start text-sm text-gray-600 mb-3">
            <MapPin size={18} className="text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>{disaster.location.address}</span>
          </div>
          
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {disaster.description}
          </p>
          
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <User size={18} className="text-gray-500 mr-2" />
            <span>Reported by: {disaster.reportedBy.name}</span>
          </div>
          
          {disaster.assignedTo && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <CheckCircle size={18} className="text-gray-500 mr-2" />
              <span>Assigned to: {disaster.assignedTo.name}</span>
            </div>
          )}
        </div>
        
        {/* Card Footer */}
        {isVolunteer && disaster.status === 'pending' && (
          <div className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-2">
            <Button 
              variant="success" 
              size="sm" 
              fullWidth 
              icon={<CheckCircle size={16} />}
              onClick={handleAccept}
            >
              Accept
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              fullWidth 
              icon={<XCircle size={16} />}
              onClick={handleDecline}
            >
              Decline
            </Button>
          </div>
        )}
        
        {isVolunteer && disaster.status === 'accepted' && disaster.assignedTo && (
          <div className="p-4 bg-gray-50 border-t">
            <Button 
              variant="success" 
              size="sm" 
              fullWidth 
              icon={<CheckSquare size={16} />}
              onClick={handleResolve}
            >
              Mark as Resolved
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default DisasterCard;