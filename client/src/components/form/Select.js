import React from 'react'

const Select = ({ className = "", children, ...props }) => {
  return (
    <select className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 ${className}`} {...props}>
      {children}
    </select>
  )
}

export default Select
