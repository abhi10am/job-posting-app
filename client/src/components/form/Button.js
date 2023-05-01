import React from "react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 text-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
