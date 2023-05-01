import Separator from 'components/Separator'
import React from 'react'
import { HiOutlineBuildingOffice } from 'react-icons/hi2'

const JobContent = ({ data }) => {
  return (
    <div>
      <div className="text-lg font-medium mb-1">{data.title}</div>
      <div className="flex items-center space-x-1 mb-1">
        <HiOutlineBuildingOffice className="text-md text-gray-500" />
        <div className="text-xs text-gray-600">{data.companyName}</div>
      </div>
      <div className="flex items-center space-x-1 mb-2">
        <div className="text-xs text-gray-600">{data.category.name}</div>
        <Separator className="mx-2" />
        <div className="text-xs text-gray-600">{data.type.name}</div>
      </div>
      <div className="text-sm mb-3 font-medium text-gray-600">
        ₹ {data.salary}
      </div>
      <div className="flex flex-wrap space-x-1 mb-4">
        {data.skills.split(', ').map((item, index) => (
          <div key={index} className="px-2 py-1 bg-gray-200 text-xs rounded">{item}</div>
        ))}
      </div>
      <div className="text-sm flex flex-wrap space-x-2 mb-6">
        <div className="">Experience required:</div>
        <div className="">{data.experience}</div>
      </div>
      <p className="text-sm whitespace-pre-line mb-6">{data.description}</p>
      <div className="space-y-2 mb-6">
        {data.additionalDetails && JSON.parse(data.additionalDetails).map((item, index) => (
          <div key={index} className="text-sm space-x-1">
            <span className="font-medium">{item.key}:</span>
            <span className="">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center flex-wrap space-x-1">
        <div className="text-sm text-gray-600 mr-2">Tags</div>
        {data.tags.split(', ').map((item, index) => (
          <div key={index} className="px-2 py-1 bg-gray-200 text-xs rounded">{item}</div>
        ))}
      </div>
    </div>
  )
}

export default JobContent
