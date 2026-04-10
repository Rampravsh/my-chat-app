import React from 'react';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

const ChatListItem = ({ chat, isSelected, onClick }) => {
  return (
    <div
      className={`flex items-center p-3 cursor-pointer rounded-lg mb-2 transition duration-200 ${
        isSelected ? 'bg-blue-100 shadow-sm' : 'hover:bg-gray-50'
      }`}
      onClick={() => onClick(chat.id)}
    >
      <ProfilePicture src={chat.avatar} alt={chat.name} size="md" />
      <div className="ml-3 flex-1">
        <h3 className="font-semibold text-gray-800">{chat.name}</h3>
        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
      </div>
      <div className="text-xs text-gray-400">{chat.time}</div>
      {/* Optional: Add unread message count badge */}
      {/* {chat.unreadCount > 0 && (
        <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {chat.unreadCount}
        </span>
      )} */}
    </div>
  );
};

export default ChatListItem;