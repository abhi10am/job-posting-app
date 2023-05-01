import React from 'react'

const Card = ({ className = "", children, ...props }) => {
  return (
    <div className={`bg-white shadow rounded-lg p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Card
