import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  FiHome,
  FiActivity,
  FiCalendar,
  FiTrendingUp,
  FiMessageSquare,
  FiUsers,
  FiAlertTriangle,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { IoIosAddCircle } from "react-icons/io";
import { FaAsterisk } from "react-icons/fa";


const Layout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // List of navigation items
  const navItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/tracker', icon: <FiCalendar />, label: 'Daily Tracker' },
    // { path: '/insights', icon: <FiTrendingUp />, label: 'Insights' },
    { path: '/gpt', icon: <FiMessageSquare />, label: 'GPT Companion' },
    { path: '/partner', icon: <FiUsers />, label: 'Partner Sync' },
    { path: '/emergency', icon: <FiAlertTriangle />, label: 'Emergency' },
    {path :'/period-tracker' , icon :<IoIosAddCircle/>, label: 'Period Tracker' },
    {path :'/pcos' , icon :<FaAsterisk/>, label: 'PCOS Risk Checker' },
    {path: '/next-period', icon: <FiActivity />, label: 'Next Period Predictor' },
    {path: '/community', icon: <FiMessageSquare />, label: 'Community' },
    {path : '/profile' , icon: <FiUsers />, label: 'Profile' },
    // {path:'/my-post', icon: <FiUsers />, label: 'My Posts' },

  ];

  // Check if current route matches nav item
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <FiHome className="text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-800">SakhiSaathi</span>
          </div>
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-auto">
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-4">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiLogOut className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <FiHome className="text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-800">SakhiSaathi</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-4">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiLogOut className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-1 mr-2 rounded-md text-gray-500 hover:text-gray-700 md:hidden"
              >
                <FiMenu size={24} />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center md:hidden">
                <FiHome className="text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800 md:hidden">SakhiSaathi</span>
              
              {/* Current page title for mobile */}
              {/* <span className="ml-4 text-lg font-medium text-gray-800 md:hidden">
                {navItems.find(item => isActive(item.path))?.label || ''}
              </span> */}
            </div>
            
            {/* Add any header actions here */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto  bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;