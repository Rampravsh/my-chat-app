import React from 'react';
import { Link } from 'react-router-dom';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Icons for profile and logout
import userService from '../../services/userService';
import authService from '../../services/authService';

const Navbar = () => {
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      const userData = await userService.getUserProfile();
      setCurrentUser(userData);
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white shadow-md rounded-b-xl">
      {/* App Logo and Name */}
      <div className="flex items-center">
        <img src="/logo.png" alt="ChitChat Logo" className="h-8 mr-2" />
        <Link to="/dashboard" className="text-xl font-bold text-gray-800">ChitChat</Link>
      </div>

      {/* User Info and Navigation */}
      {currentUser && (
        <div className="flex items-center space-x-4">
          <ProfilePicture src={'/user1.jpg' || currentUser.pic} alt={currentUser.name} size="sm" />
          <span className="font-semibold text-gray-700 hidden sm:block">{currentUser.name}</span>
          
          <Link to="/profile" className="flex items-center text-gray-600 hover:text-blue-500 transition duration-200">
            <FaUserCircle className="mr-1" />
            <span className="hidden sm:block">Profile</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-red-500 transition duration-200"
          >
            <FaSignOutAlt className="mr-1" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;