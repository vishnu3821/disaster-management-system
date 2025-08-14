import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Short Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold">Disaster<span className="text-red-500">SOS</span></span>
            </Link>
            <p className="text-gray-400 text-sm">
              Connecting those in need with volunteers during disaster situations.
              Quick response saves lives.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/report-disaster" className="text-gray-400 hover:text-white transition">Report Disaster</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition">Volunteer Signup</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition">Login</Link>
              </li>
            </ul>
          </div>

          {/* Help & Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Emergency Preparedness</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Training Resources</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Disaster Types</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-red-500 mt-0.5" />
                <span className="text-gray-400">2300033040cseh@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                <span className="text-gray-400">Vaddeswaram, KL University</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} DisasterSOS. All rights reserved. Copyrights Reserved.
            </p>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;