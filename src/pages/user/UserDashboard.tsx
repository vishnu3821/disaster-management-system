import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  PlusCircle, 
  Filter, 
  Search, 
  MapPin,
  Clock,
  AlertOctagon
} from 'lucide-react';
import { useDisasters } from '../../contexts/DisasterContext';
import { useAuth } from '../../contexts/AuthContext';
import DisasterCard from '../../components/disaster/DisasterCard';
import Button from '../../components/common/Button';
import { showAlert } from '../../components/common/AlertMessage';

const UserDashboard: React.FC = () => {
  const { userDisasters, isLoading } = useDisasters();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  if (!user) return null;

  const handleSOSClick = () => {
    navigate('/report-disaster');
    showAlert({
      message: 'Emergency reporting mode activated',
      type: 'warning'
    });
  };

  const filteredDisasters = userDisasters.filter(disaster => {
    const matchesSearch = 
      disaster.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      disaster.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || disaster.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* SOS Button - Fixed Position */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={handleSOSClick}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform"
        >
          <AlertOctagon size={32} />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Disaster Reports</h1>
            <p className="text-gray-600 mt-1">Track and manage your reported incidents</p>
          </div>
          
          <Link to="/report-disaster">
            <Button
              variant="primary"
              icon={<PlusCircle size={18} />}
              className="mt-4 sm:mt-0"
            >
              Report New Disaster
            </Button>
          </Link>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Reports</p>
            <p className="text-2xl font-bold text-gray-800">{userDisasters.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {userDisasters.filter(d => d.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Accepted</p>
            <p className="text-2xl font-bold text-blue-600">
              {userDisasters.filter(d => d.status === 'accepted').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Resolved</p>
            <p className="text-2xl font-bold text-green-600">
              {userDisasters.filter(d => d.status === 'resolved').length}
            </p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="Search by title, description or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : userDisasters.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Disaster Reports Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't reported any disasters yet. Use the button below to report a new incident.
          </p>
          <Link to="/report-disaster">
            <Button icon={<PlusCircle size={18} />}>
              Report a Disaster
            </Button>
          </Link>
        </div>
      ) : filteredDisasters.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Results</h3>
          <p className="text-gray-600">
            No disaster reports match your current search and filter criteria. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDisasters.map(disaster => (
            <DisasterCard key={disaster.id} disaster={disaster} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;