import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';
import { FaEdit, FaUser, FaEnvelope, FaLock, FaInfoCircle } from 'react-icons/fa';
import userService from '../../services/userService'; // Import user service
import { useAuth } from '../../contexts/AuthContext'; // To update global user state

const ProfilePage = () => {
  const { user, setUser } = useAuth(); // Get user and setUser from AuthContext
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserProfile(); // Fetch profile from backend
        setProfileData({
          name: data.name,
          email: data.email,
          bio: data.bio || '', // Handle potentially missing bio
          avatar: data.avatar || '/user1.jpg', // Use default if no avatar
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []); // Run once on component mount

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUpdateSuccess('');

    try {
      const updatedUser = await userService.updateProfile(profileData); // Update profile
      setUser(updatedUser); // Update user in global context
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Update in localStorage
      setProfileData({ // Update local state as well
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio || '',
        avatar: updatedUser.avatar || '/user1.jpg',
      });
      setIsEditing(false);
      setUpdateSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result })); // This will be base64 string
        // You might need to send this as a file to backend or handle differently
        console.log("Avatar selected:", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading && !profileData.name) { // Show loading only initially
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mt-16 mx-auto p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl mx-auto mt-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">My Profile</h2>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {updateSuccess && <p className="text-green-500 text-sm mb-4 text-center">{updateSuccess}</p>}

          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <ProfilePicture src={profileData.avatar} alt={profileData.name} size="lg" />
              {isEditing && (
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition duration-200 shadow-md">
                  <FaEdit className="w-4 h-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>
            <h3 className="text-2xl font-semibold mt-4 text-gray-800">{profileData.name}</h3>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div className="space-y-4 mb-6">
              {/* Name */}
              <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <FaUser className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`flex-1 bg-transparent focus:outline-none ${isEditing ? 'border-b border-blue-400' : ''}`}
                />
                {!isEditing && <FaEdit onClick={() => setIsEditing(true)} className="text-gray-400 cursor-pointer hover:text-blue-500" />}
              </div>

              {/* Email */}
              <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <FaEnvelope className="text-gray-500 mr-3" />
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  readOnly
                  className="flex-1 bg-transparent focus:outline-none text-gray-600"
                />
                <span className="text-gray-400 text-sm">Read-only</span>
              </div>

              {/* Password (no direct display, just change button) */}
              <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <FaLock className="text-gray-500 mr-3" />
                <input
                  type="password"
                  value="********" // Masked password
                  readOnly
                  className="flex-1 bg-transparent focus:outline-none"
                />
                <button type="button" className="text-blue-600 hover:underline text-sm">
                  Change Password
                </button>
              </div>

              {/* Bio */}
              <div className="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                <FaInfoCircle className="text-gray-500 mr-3 mt-1" />
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  rows="3"
                  className={`flex-1 bg-transparent focus:outline-none resize-none ${isEditing ? 'border-b border-blue-400' : ''}`}
                />
                {!isEditing && <FaEdit onClick={() => setIsEditing(true)} className="text-gray-400 cursor-pointer hover:text-blue-500" />}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              {isEditing && (
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              )}
              <button
                type="button"
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                onClick={() => console.log('Delete Account')}
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;