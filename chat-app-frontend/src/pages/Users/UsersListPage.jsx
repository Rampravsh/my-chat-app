import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';
import { FaSearch, FaCommentDots } from 'react-icons/fa';
import userService from '../../services/userService'; // Import user service
import chatService from '../../services/chatService'; // Import chat service
import { useNavigate } from 'react-router-dom';

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers(); // Fetch all users from backend
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError(err.response?.data?.message || 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

 const handleStartChat = async (userId) => {
    try {
      const chat = await chatService.accessChat(userId);
      console.log('Accessed chat:', chat);
      // Navigate to dashboard and pass the new chat's ID in state
      navigate('/dashboard', { state: { chatId: chat._id } }); // Pass chat ID in state
    } catch (err) {
      console.error('Failed to access chat:', err);
      setError(err.response?.data?.message || 'Failed to start chat.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading Users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mt-16 mx-auto p-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl mx-auto mt-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Find Users</h2>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Users List */}
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar pr-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user._id || user.id} className="flex items-center justify-between p-3 mb-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200">
                  <div className="flex items-center">
                    <ProfilePicture src={'/user1.jpg' || user.pic} alt={user.name} size="md" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartChat(user._id || user.id)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 cursor-pointer to-purple-600 text-white rounded-full text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-300 shadow-md flex items-center"
                  >
                    <FaCommentDots className="mr-2" /> Message
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersListPage;