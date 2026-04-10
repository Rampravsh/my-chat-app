import React from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa"; // Icons from react-icons

const Icon = ({ name }) => {
  switch (name) {
    case "user":
      return <FaUser />;
    case "password":
      return <FaLock />;
    case "email":
      return <FaEnvelope />;
    default:
      return null;
  }
};

const InputField = ({ type, placeholder, icon, ...props }) => {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <Icon name={icon} />
      </div>
      <input
        type={type}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 placeholder-gray-400"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default InputField;
