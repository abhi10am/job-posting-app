import React from 'react'

const InputLabel = ({ children, className = "", ...props }) => {
  return (
    <label className={`block mb-2 text-sm font-medium text-gray-900 ${className}`} {...props}>{children}</label>
  )
}

export default InputLabel
