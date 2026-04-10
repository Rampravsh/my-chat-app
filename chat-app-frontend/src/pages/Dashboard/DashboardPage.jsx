import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import ChatListItem from '../../components/ChatListItem/ChatListItem';
import ChatMessage from '../../components/ChatMessage/ChatMessage';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';
import { FaPaperclip, FaPaperPlane, FaSearch, FaCommentDots } from 'react-icons/fa';
import chatService from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Added useLocation
import io from 'socket.io-client'; // Import Socket.IO client

// --- Socket.IO setup ---
// Replace with your backend socket.io server URL
const ENDPOINT = 'http://localhost:5000'; // Or your deployed backend URL
let socket; // Global variable for socket connection
let selectedChatCompare; // To compare selected chat for message arrival

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // To get chat ID from navigation state

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // State to show "X is typing..."
  
  const messagesEndRef = useRef(null); // Ref for auto-scrolling to bottom

  // --- Socket.IO Connection and Setup ---
  useEffect(() => {
    // Connect to Socket.IO server
    socket = io(ENDPOINT);
    socket.emit('setup', user); // Emit 'setup' event with current user info

    socket.on('connected', () => {
      setSocketConnected(true);
      console.log('Socket.IO connected!');
    });

    // Listener for typing event
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [user]); // Reconnect if user changes

  // --- Handle New Message Received ---
  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      // Check if it's for the currently selected chat
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Not the selected chat, handle notification/update chat list
        console.log('New message received for another chat:', newMessageReceived);
        // Implement logic to update chat list to show new message or unread count
        setChats(prevChats => prevChats.map(chat => 
          chat._id === newMessageReceived.chat._id 
            ? { ...chat, latestMessage: newMessageReceived, unreadCount: (chat.unreadCount || 0) + 1 } // Example: add unread count
            : chat
        ));
      } else {
        // It's for the currently selected chat, add to messages
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    // Cleanup: remove listener when component unmounts or dependencies change
    return () => {
      socket.off('message received');
    };
  }); // No dependencies means it runs on every render, but only adds listener once via closure

  // --- Auto-scroll to bottom of messages ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // --- Fetch chats for the logged-in user ---
  useEffect(() => {
    const getChats = async () => {
      try {
        setLoadingChats(true);
        setError('');
        const data = await chatService.fetchChats();
        setChats(data);
        if (data.length > 0) {
          // Check if a specific chat ID was passed via navigation state
          const initialChatId = location.state?.chatId;
          const chatToSelect = initialChatId ? data.find(c => c._id === initialChatId) : data[0];
          setSelectedChat(chatToSelect || data[0]); // Select it if found, else first chat
        }
      } catch (err) {
        console.error('Failed to fetch chats:', err);
        setError(err.response?.data?.message || 'Failed to load chats.');
      } finally {
        setLoadingChats(false);
      }
    };
    getChats();
  }, [location.state?.chatId]); // Re-fetch chats if initialChatId changes

  // --- Fetch messages for the selected chat ---
  useEffect(() => {
    const getMessages = async () => {
      if (selectedChat) {
        try {
          setLoadingMessages(true);
          setError('');
          const data = await chatService.allMessages(selectedChat._id);
          setMessages(data);
          socket.emit('join chat', selectedChat._id); // Join the socket room for this chat
          selectedChatCompare = selectedChat; // Update global var for message comparison
        } catch (err) {
          console.error('Failed to fetch messages:', err);
          setError(err.response?.data?.message || 'Failed to load messages.');
        } finally {
          setLoadingMessages(false);
        }
      } else {
        setMessages([]);
      }
    };
    getMessages();
  }, [selectedChat]); // Re-fetch messages when selectedChat changes

  const handleChatSelect = (chatId) => {
    const chat = chats.find(c => c._id === chatId);
    setSelectedChat(chat);
    setError('');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !socketConnected) return;

    socket.emit('stop typing', selectedChat._id); // Stop typing before sending message

    try {
      const messageData = {
        chatId: selectedChat._id,
        content: newMessage,
      };
      const sentMessage = await chatService.sendMessage(messageData);
      socket.emit('new message', sentMessage); // Emit new message via socket
      setMessages([...messages, sentMessage]);
      setNewMessage('');
      
      // Optimistically update chat list with new message
      setChats(prevChats => prevChats.map(c => 
        c._id === selectedChat._id 
          ? { ...c, latestMessage: sentMessage, time: new Date(sentMessage.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) } 
          : c
      ));

    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.response?.data?.message || 'Failed to send message.');
    }
  };

  // --- Typing indicator logic ---
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000; // 3 seconds
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const currentUserAvatar = user?.avatar || '/user5.jpg';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="container mt-16 mx-auto p-4 flex flex-col md:flex-row flex-grow gap-4 justify-between">
        {/* Left Sidebar: Chat List */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-xl shadow-md flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaCommentDots className="mr-2 text-blue-500" /> Chats
            </h2>
            <Link to="/users" className="text-blue-500 hover:text-blue-600">
              <FaCommentDots className="h-6 w-6" />
            </Link>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {loadingChats ? (
              <p className="text-center text-gray-500">Loading chats...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : chats.length > 0 ? (
              chats.map(chat => (
                <ChatListItem
                  key={chat._id}
                  chat={{
                    id: chat._id,
                    name: chat.isGroupChat ? chat.chatName : chat.users.find(u => u._id !== user._id)?.name || 'Unknown User', // Logic for chat name
                    avatar: chat.isGroupChat ? '/group-avatar.jpg' : chat.users.find(u => u._id !== user._id)?.avatar || '/user1.jpg',
                    lastMessage: chat.latestMessage?.content || 'No messages yet',
                    time: chat.latestMessage ? new Date(chat.latestMessage.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
                  }}
                  isSelected={selectedChat && chat._id === selectedChat._id}
                  onClick={handleChatSelect}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No chats found. Start a new one!</p>
            )}
          </div>
        </div>

        {/* Right Content: Chat Window */}
        <div className="w-full md:w-2/3 bg-white p-4 rounded-xl shadow-md flex flex-col">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center border-b pb-3 mb-4">
                <ProfilePicture src={selectedChat.isGroupChat ? '/group-avatar.jpg' : selectedChat.users.find(u => u._id !== user._id)?.avatar || '/user1.jpg'} alt={selectedChat.chatName} size="md" />
                <h3 className="text-xl font-semibold ml-3 text-gray-800">{selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.users.find(u => u._id !== user._id)?.name || 'Unknown User'}</h3>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                {loadingMessages ? (
                  <p className="text-center text-gray-500">Loading messages...</p>
                ) : messages.length > 0 ? (
                  messages.map(message => (
                    <ChatMessage
                      key={message._id}
                      message={{
                        id: message._id,
                        senderName: message.sender.name,
                        avatar: message.sender.avatar || '/user1.jpg',
                        text: message.content,
                        time: new Date(message.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                      }}
                      isCurrentUser={message.sender._id === user._id}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500">No messages yet. Say hello!</p>
                )}
                <div ref={messagesEndRef} /> {/* Auto-scroll target */}
              </div>

              {/* Typing indicator */}
              {isTyping && (
                <div className="text-sm text-gray-500 mb-2 pl-2">
                  <span className="animate-pulse">Typing...</span>
                </div>
              )}

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="border-t pt-4 mt-4 flex items-center bg-white">
                <button type="button" className="p-2 text-gray-500 hover:text-blue-500 transition duration-200">
                  <FaPaperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  placeholder="Message..."
                  className="flex-1 mx-3 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  value={newMessage}
                  onChange={typingHandler} // Use typing handler
                />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 shadow-md">
                  <FaPaperPlane className="h-5 w-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-lg">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;