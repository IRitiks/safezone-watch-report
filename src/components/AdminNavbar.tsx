
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Shield, LogOut, BarChart, MapPin, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };
  
  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center">
              <Shield className="h-8 w-8 text-safezone-lightPurple mr-2" />
              <span className="text-xl font-bold text-safezone-lightPurple">SafeZone Admin</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/admin" className={`${isActive('/admin') ? 'text-safezone-lightPurple font-medium' : 'text-gray-300 hover:text-safezone-lightPurple'}`}>
              Dashboard
            </Link>
            <Link to="/admin/reports" className={`${isActive('/admin/reports') ? 'text-safezone-lightPurple font-medium' : 'text-gray-300 hover:text-safezone-lightPurple'}`}>
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Reports
              </div>
            </Link>
            <Link to="/admin/map" className={`${isActive('/admin/map') ? 'text-safezone-lightPurple font-medium' : 'text-gray-300 hover:text-safezone-lightPurple'}`}>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Incident Map
              </div>
            </Link>
            <Link to="/admin/analytics" className={`${isActive('/admin/analytics') ? 'text-safezone-lightPurple font-medium' : 'text-gray-300 hover:text-safezone-lightPurple'}`}>
              <div className="flex items-center">
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </div>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="text-gray-300 hover:text-white">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {/* Mobile menu implementation */}
          </div>
        </div>
        
        {/* Mobile bottom navigation */}
        <div className="md:hidden flex justify-around py-2 border-t border-gray-800">
          <Link to="/admin" className={`flex flex-col items-center p-2 ${isActive('/admin') ? 'text-safezone-lightPurple' : 'text-gray-400'}`}>
            <Shield size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          
          <Link to="/admin/reports" className={`flex flex-col items-center p-2 ${isActive('/admin/reports') ? 'text-safezone-lightPurple' : 'text-gray-400'}`}>
            <AlertTriangle size={20} />
            <span className="text-xs mt-1">Reports</span>
          </Link>
          
          <Link to="/admin/map" className={`flex flex-col items-center p-2 ${isActive('/admin/map') ? 'text-safezone-lightPurple' : 'text-gray-400'}`}>
            <MapPin size={20} />
            <span className="text-xs mt-1">Map</span>
          </Link>
          
          <Link to="/admin/analytics" className={`flex flex-col items-center p-2 ${isActive('/admin/analytics') ? 'text-safezone-lightPurple' : 'text-gray-400'}`}>
            <BarChart size={20} />
            <span className="text-xs mt-1">Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
