import React from "react";

const Button = ({ variant="primary", size="default", children, className="", ...props }) => {
  const variants = {
    "primary": "text-white bg-primary-600 hover:bg-primary-700",
    "secondary": "text-gray-800 bg-transparent border-2 border-solid border-gray-400",
    "success": "text-white bg-green-600 hover:bg-green-700",
    "danger": "text-white bg-red-600 hover:bg-red-700",
    "primary-soft": "text-primary-800 bg-primary-100 hover:bg-primary-200",
    "success-soft": "text-green-800 bg-green-100 hover:bg-green-200",
    "danger-soft": "text-red-800 bg-red-100 hover:bg-red-200",
    "link": "text-gray-800 bg-transparent",
  }
  // text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 text-sm  
  
  return (
    <button
      className={`focus:outline-none font-medium rounded-lg px-4 py-2 text-center disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
