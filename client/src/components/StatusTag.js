import React from 'react'

const StatusTag = ({ status, className, ...props }) => {
  const values = {
    PENDING: "bg-amber-200 text-amber-800",
    APPROVED: "bg-green-200 text-green-800",
    REJECTED: "bg-red-200 text-red-800"
  }

  return (
    <div 
      className={`text-xs font-medium px-2 py-1 rounded ${values[status] ?? "bg-gray-200 text-gray-800"} ${className}`} 
      {...props}
    >
      {status}
    </div>
  )
}

export default StatusTag
