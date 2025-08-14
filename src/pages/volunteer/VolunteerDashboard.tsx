import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  RefreshCw, 
  MapPin,
  BellRing,
  CheckCircle,
  XCircle,
  CheckSquare
} from 'lucide-react';
import { useDisasters } from '../../contexts/DisasterContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import DisasterCard from '../../components/disaster/DisasterCard';
import Button from '../../components/common/Button';
import { showAlert } from '../../components/common/AlertMessage';

const VolunteerDashboard: React.FC = () => {
  const { volunteerDisasters, isLoading, updateStatus, refreshDisasters } = useDisasters();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  
  if (!user) return null;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshDisasters();
      showAlert({
        message: 'Dashboard refreshed with latest disaster reports',
        type: 'success'
      });
    } catch (error) {
      showAlert({
        message: 'Failed to refresh. Please try again.',
        type: 'error'
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleAcceptDisaster = async (disasterId: string) => {
    try {
      await updateStatus(disasterId, 'accepted', user.id);
      addNotification({
        message: 'You have accepted a disaster report. Please coordinate help immediately.',
        type: 'success',
        relatedTo: {
          type: 'disaster',
          id: disasterId
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
    }
  };

  const handleDeclineDisaster = async (disasterId: string) => {
    try {
      await updateStatus(disasterId, 'declined');
      showAlert({
        message: 'Disaster declined',
        type: 'info'
      });
    } catch (error) {
      showAlert({
        message: 'Failed to decline the disaster. Please try again.',
        type: 'error'
      });
    }
  };

  const handleResolveDisaster = async (disasterId: string) => {
    try {
      await updateStatus(disasterId, 'resolved');
      addNotification({
        message: 'You have marked a disaster as resolved. Thank you for your help!',
        type: 'success',
        relatedTo: {
          type: 'disaster',
          id: disasterId
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
    }
  };

  const filteredDisasters = volunteerDisasters.filter(disaster => {
    const matchesSearch = 
      disaster.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      disaster.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || disaster.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || disaster.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  // Sort disasters by severity and status
  const sortedDisasters = [...filteredDisasters].sort((a, b) => {
    // Sort by status (pending first)
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    
    // Then by severity (critical first)
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  // Count disasters by status
  const pendingCount = volunteerDisasters.filter(d => d.status === 'pending').length;
  const acceptedCount = volunteerDisasters.filter(d => 
    d.status === 'accepted' && d.assignedTo && d.assignedTo.id === user.id
  ).length;
  const resolvedCount = volunteerDisasters.filter(d => 
    d.status === 'resolved' && d.assignedTo && d.assignedTo.id === user.id
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Volunteer Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage disaster reports and coordinate assistance</p>
          </div>
          
          <Button
            variant="outline"
            icon={<RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />}
            onClick={handleRefresh}
            isLoading={refreshing}
          >
            Refresh
          </Button>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <BellRing className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Accepted</p>
                <p className="text-2xl font-bold text-gray-800">{acceptedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckSquare className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Resolved</p>
                <p className="text-2xl font-bold text-gray-800">{resolvedCount}</p>
              </div>
            </div>
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
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Search by title, description or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-1 md:space-x-4">
              <div className="flex items-center">
                <Filter size={18} className="text-gray-500 mr-2 hidden md:block" />
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <option value="all">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : volunteerDisasters.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <BellRing className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Disaster Reports Available</h3>
          <p className="text-gray-600 mb-6">
            There are currently no disaster reports that need your assistance. 
            Check back later or refresh to see new reports.
          </p>
          <Button 
            icon={<RefreshCw size={18} />}
            onClick={handleRefresh}
            isLoading={refreshing}
          >
            Refresh Dashboard
          </Button>
        </div>
      ) : sortedDisasters.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Results</h3>
          <p className="text-gray-600">
            No disaster reports match your current search and filter criteria. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDisasters.map(disaster => (
            <DisasterCard 
              key={disaster.id} 
              disaster={disaster} 
              isVolunteer={true}
              onAccept={handleAcceptDisaster}
              onDecline={handleDeclineDisaster}
              onResolve={handleResolveDisaster}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;