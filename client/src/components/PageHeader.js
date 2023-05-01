import React from 'react'

const PageHeader = ({ title, actions }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h6 className="text-lg font-bold">{title}</h6>
      <div>{actions}</div>
    </div>
  )
}

export default PageHeader
