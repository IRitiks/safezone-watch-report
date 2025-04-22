import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Siren, AlertTriangle, MapPin, Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 md:relative md:border-t-0 md:border-b md:py-0">
      <div className="container mx-auto">
        {/* Mobile bottom navigation bar */}
        <div className="flex justify-around md:hidden">
          <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-safezone-purple' : 'text-gray-600'}`}>
            <Shield size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link to="/incidents" className={`flex flex-col items-center p-2 ${isActive('/incidents') ? 'text-safezone-purple' : 'text-gray-600'}`}>
            <AlertTriangle size={24} />
            <span className="text-xs mt-1">Incidents</span>
          </Link>
          
          <Link to="/report" className={`flex flex-col items-center p-2 ${isActive('/report') ? 'text-safezone-purple' : 'text-gray-600'}`}>
            <MapPin size={24} />
            <span className="text-xs mt-1">Report</span>
          </Link>
          
          <Link to="/emergency" className={`flex flex-col items-center p-2 ${isActive('/emergency') ? 'text-safezone-red' : 'text-red-500'}`}>
            <Siren size={24} />
            <span className="text-xs mt-1">SOS</span>
          </Link>
        </div>
        
        {/* Desktop top navigation bar */}
        <div className="hidden md:flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-safezone-purple mr-2" />
              <span className="text-xl font-bold text-safezone-purple">SafeZone</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className={`${isActive('/') ? 'text-safezone-purple font-medium' : 'text-gray-600 hover:text-safezone-purple'}`}>
              Home
            </Link>
            <Link to="/incidents" className={`${isActive('/incidents') ? 'text-safezone-purple font-medium' : 'text-gray-600 hover:text-safezone-purple'}`}>
              Recent Incidents
            </Link>
            <Link to="/safety-tips" className={`${isActive('/safety-tips') ? 'text-safezone-purple font-medium' : 'text-gray-600 hover:text-safezone-purple'}`}>
              Safety Tips
            </Link>
            <Link to="/report">
              <Button className="bg-safezone-purple hover:bg-safezone-darkPurple">
                Report Incident
              </Button>
            </Link>
            <Link to="/emergency">
              <Button variant="destructive" className="animate-pulse-emergency">
                <Siren className="mr-2 h-4 w-4" />
                Emergency SOS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
