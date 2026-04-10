import API from './api';

const getUserProfile = async () => {
  const response = await API.get('/user/profile');
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await API.put('/user/profile', profileData); // Assuming PUT for update
  return response.data;
};

const getAllUsers = async () => {
  const response = await API.get('/user'); // Based on router.route('/').get(protect, getAllUsers);
  return response.data;
};

const userService = {
  getUserProfile,
  updateProfile,
  getAllUsers,
};

export default userService;