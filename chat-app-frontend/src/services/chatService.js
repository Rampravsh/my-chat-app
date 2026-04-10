import API from './api';

const accessChat = async (userId) => {
  const response = await API.post('/chat', { userId }); // Based on router.route('/').post(protect, accessChat);
  return response.data;
};

const fetchChats = async () => {
  const response = await API.get('/chat'); // Based on router.route('/').get(protect, fetchChats);
  return response.data;
};

const allMessages = async (chatId) => {
  const response = await API.get(`/chat/${chatId}`); // Based on router.route('/:chatId').get(protect, allMessages);
  return response.data;
};

const sendMessage = async (messageData) => {
  const response = await API.post('/chat/message', messageData); // Based on router.route('/').post(protect, sendMessage);
  return response.data;
};

const chatService = {
  accessChat,
  fetchChats,
  allMessages,
  sendMessage,
};

export default chatService;