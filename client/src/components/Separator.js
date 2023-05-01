import React from 'react'

const Separator = ({ className, ...props }) => {
  return (
    <div className={`w-1 h-1 bg-gray-300 rounded-full ${className}`} {...props}></div>
  )
}

export default Separator
