import React from 'react';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

const ChatMessage = ({ message, isCurrentUser }) => {
  const messageBg = isCurrentUser
    ? 'bg-blue-500 text-white rounded-br-none'
    : 'bg-gray-200 text-gray-800 rounded-bl-none';
  const messageAlign = isCurrentUser ? 'self-end' : 'self-start';
  const avatarOrder = isCurrentUser ? 'order-2 ml-2' : 'order-1 mr-2';

  return (
    <div className={`flex items-end mb-4 ${messageAlign}`}>
      <ProfilePicture src={message.avatar} alt={message.senderName} size="sm" className={avatarOrder} />
      <div
        className={`p-3 rounded-lg max-w-[70%] ${messageBg} shadow-sm ${
          isCurrentUser ? 'order-1' : 'order-2'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <span className={`block text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'} text-right`}>
          {message.time}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;