import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  name: string;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Users', path: '/admin/users' },
  { name: 'Reasons', path: '/admin/reasons' },
  { name: 'Reports', path: '/reports' }
];

const AdminHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { profile } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-10 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white bg-opacity-95'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center">
              <div className="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">SC</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Admin Portal</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* User Profile and Notifications */}
          <div className="hidden md:flex items-center">
            <button className="relative p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 mr-2">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center mr-2">
                <span className="font-medium text-sm">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </span>
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium text-gray-800">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-gray-500 text-xs">Administrator</p>
              </div>
              <ChevronDown size={16} className="ml-1 text-gray-500" />
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 text-base font-medium ${
                location.pathname === item.path
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="border-t border-gray-200 pt-4 pb-2 px-4 mt-2">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center mr-3">
                <span className="font-medium">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-gray-500 text-sm">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;