import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Users, Clock, Map } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      if (user.role === 'user') {
        navigate('/report-disaster');
      } else {
        navigate('/volunteer/dashboard');
      }
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/1882979/pexels-photo-1882979.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')", 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Rapid Response When<br />Every Second Counts
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              DisasterSOS connects those affected by disasters with volunteers ready to help. Report incidents quickly and get the assistance you need.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                icon={<AlertTriangle size={20} />}
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/register')}
                className="border-2 border-white text-white hover:bg-white hover:bg-opacity-10"
              >
                Become a Volunteer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform streamlines the disaster response process, connecting those in need with trained volunteers quickly and efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Report a Disaster</h3>
              <p className="text-gray-600">
                Quickly fill out our simple form with details about the incident, severity, and location.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast Assignment</h3>
              <p className="text-gray-600">
                Volunteers in your area are immediately notified and can accept your request for help.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Get Help</h3>
              <p className="text-gray-600">
                Receive real-time updates as volunteers respond and coordinate assistance efforts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Disasters Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Types of Disasters We Handle</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our network of volunteers is trained to respond to various emergency situations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Flood */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/1756132/pexels-photo-1756132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Flood</h3>
                <p className="text-gray-600 text-sm">
                  Assistance with evacuation, temporary shelter, and supplying clean water during flooding events.
                </p>
              </div>
            </div>
            
            {/* Fire */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/50694/pexels-photo-50694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Fire</h3>
                <p className="text-gray-600 text-sm">
                  Emergency response for wildfires and building fires, including evacuation coordination and support.
                </p>
              </div>
            </div>
            
            {/* Earthquake */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/16027704/pexels-photo-16027704/free-photo-of-earthquake-damage-in-aleppo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Earthquake</h3>
                <p className="text-gray-600 text-sm">
                  Search and rescue operations, medical assistance, and temporary shelter after seismic events.
                </p>
              </div>
            </div>
            
            {/* Hurricane */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Hurricane</h3>
                <p className="text-gray-600 text-sm">
                  Pre-storm preparation, evacuation assistance, and post-hurricane recovery and cleanup efforts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4">Become a Volunteer</h2>
              <p className="text-blue-100 text-lg">
                Join our network of volunteers and make a difference in your community. 
                Your skills and time can save lives during critical situations.
              </p>
            </div>
            
            <div>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/register')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700"
              >
                Sign Up as Volunteer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Disaster Response Network</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our volunteers are stationed across the country, ready to respond to emergencies in their local areas.
            </p>
          </div>
          
          <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Interactive map would be displayed here, showing active disasters and volunteer locations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Community Impact</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Read about the real experiences of people who have used DisasterSOS during emergencies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-700 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-gray-500">Flood Victim</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "When the floods hit our neighborhood, I didn't know where to turn. Within minutes of using DisasterSOS, a volunteer team was coordinating our evacuation. They saved my family."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-700 font-bold">MJ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Maria Johnson</h4>
                  <p className="text-sm text-gray-500">Volunteer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a volunteer, this platform has allowed me to use my emergency response training to help people in real need. The coordination through the app makes our response so much more effective."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-700 font-bold">RS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Robert Smith</h4>
                  <p className="text-sm text-gray-500">Community Leader</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "After the hurricane devastated our town, DisasterSOS volunteers were among the first to arrive. Their organized approach to helping our community rebuild was invaluable."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you need help or want to offer assistance, join our community today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-red-600"
              onClick={() => navigate('/register')}
            >
              Create an Account
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-red-600 hover:bg-gray-100"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;