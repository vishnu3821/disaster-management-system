import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Map, Camera, Upload } from 'lucide-react';
import { useDisasters } from '../../contexts/DisasterContext';
import { useAuth } from '../../contexts/AuthContext';
import { showAlert } from '../../components/common/AlertMessage';
import Button from '../../components/common/Button';

const ReportDisaster: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'flood' | 'earthquake' | 'fire' | 'hurricane' | 'other'>('other');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createNewDisaster } = useDisasters();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      showAlert({
        message: 'Please log in to report a disaster',
        type: 'error',
        timeout: 3000
      });
      navigate('/login');
    }
  }, [user, navigate]);

  // For a real implementation, you would use a maps API to get coordinates
  // This is just a simple mock function
  const getCoordinatesFromAddress = (address: string) => {
    // Mock coordinates - in a real app you would use geocoding
    return {
      lat: 40.7128 + Math.random() * 0.1,
      lng: -74.0060 + Math.random() * 0.1
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showAlert({
        message: 'Please log in to report a disaster',
        type: 'error',
        timeout: 3000
      });
      navigate('/login');
      return;
    }

    // Frontend validation
    if (title.length < 5) {
      showAlert({
        message: 'Title must be at least 5 characters long',
        type: 'error',
        timeout: 3000
      });
      return;
    }

    if (description.length < 10) {
      showAlert({
        message: 'Description must be at least 10 characters long',
        type: 'error',
        timeout: 3000
      });
      return;
    }

    if (!address.trim()) {
      showAlert({
        message: 'Please enter a valid address',
        type: 'error',
        timeout: 3000
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Get coordinates from address
      const coordinates = getCoordinatesFromAddress(address);
      
      console.log('Submitting disaster report:', {
        title,
        description,
        type,
        severity,
        location: { address, coordinates },
        user: user.id
      });
      
      // Create the disaster report
      const newDisaster = await createNewDisaster({
        title,
        description,
        type,
        severity,
        location: {
          address,
          coordinates
        }
      });
      
      console.log('Disaster created successfully:', newDisaster);
      
      showAlert({
        message: 'Disaster reported successfully. Help is on the way!',
        type: 'success',
        timeout: 5000
      });
      
      // Navigate to the disaster details page
      navigate(`/disaster/${newDisaster.id}`);
    } catch (error) {
      console.error('Error creating disaster:', error);
      showAlert({
        message: `Failed to report disaster: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
        timeout: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render the form if user is not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">
            Please log in to report a disaster
          </p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Report a Disaster</h1>
          <p className="text-gray-600">
            Provide details about the emergency situation so volunteers can respond quickly
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Alert Banner */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  For life-threatening emergencies, please call emergency services immediately at <strong>911</strong> before submitting this form.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title/Summary <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={5}
                  maxLength={100}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="Brief description of the emergency (minimum 5 characters)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {title.length}/100 characters
                </p>
              </div>
              
              {/* Type and Severity */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Disaster Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  >
                    <option value="flood">Flood</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="fire">Fire</option>
                    <option value="hurricane">Hurricane</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                    Severity Level <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="severity"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  >
                    <option value="low">Low (Minor Damage/Few People Affected)</option>
                    <option value="medium">Medium (Moderate Damage/Several People Affected)</option>
                    <option value="high">High (Major Damage/Many People Affected)</option>
                    <option value="critical">Critical (Severe Damage/Life Threatening)</option>
                  </select>
                </div>
              </div>
              
              {/* Location */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Location/Address <span className="text-red-600">*</span>
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Map size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="focus:ring-red-500 focus:border-red-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                      placeholder="Enter the exact address or location"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Please be as specific as possible to help volunteers find the location quickly
                </p>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Detailed Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  minLength={10}
                  maxLength={1000}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="Provide as much detail as possible about the situation, people affected, and immediate needs (minimum 10 characters)"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  {description.length}/1000 characters
                </p>
              </div>
              
              {/* Photos - In a real app, you would implement file upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Photos (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
                      >
                        <span>Upload images</span>
                        <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" disabled />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Photos can help volunteers better understand the situation and prepare appropriately
                </p>
              </div>
              
              {/* Submit Button */}
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-4"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  icon={<AlertTriangle size={18} />}
                >
                  Report Emergency
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportDisaster;