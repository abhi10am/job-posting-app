import Card from 'components/Card'
import CustomLink from 'components/CustomLink'
import Loader from 'components/Loader'
import PageTitle from 'components/PageTitle'
import Separator from 'components/Separator'
import Button from 'components/form/Button'
import MasterLayout from 'components/layout/MasterLayout'
import React, { useEffect, useState } from 'react'
import { useGetJobByIdQuery, useGetJobsQuery } from 'store/apis/admin/job'
import { JobList } from 'components/job/JobList'


const JobDetail = ({ id }) => {
  const { data, isLoading, isFetching } = useGetJobByIdQuery(id);

  if (!id || isLoading || isFetching) return <Loader />

  if (!data && !isLoading && !isFetching) {
    return <div className="flex items-center justify-center">No data found</div>
  }

  return (
    <Card className="">
      <div className="text-lg font-medium mb-1">{data.title}</div>
      <div className="flex items-center space-x-1 mb-1">
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
    </Card>
  )
}

const Jobs = () => {
  const { data: jobs, isLoading, isFetching } = useGetJobsQuery();
  const [jobDetailId, setJobDetailId] = useState(null);

  useEffect(() => {
    if (jobs) setJobDetailId(jobs[0].id);
  }, [jobs]);

  const handleViewJobDetail = (id) => {
    setJobDetailId(id);
  }

  return (
    <MasterLayout>
      <div className="flex items-center justify-between mb-8">
        <PageTitle>All Jobs</PageTitle>
        <CustomLink to="/admin/jobs/create">
          <Button type="button">Post New Job</Button>
        </CustomLink>
      </div>

      <div className="flex space-x-2">
        <div className="w-1/2">
          <JobList 
            jobs={jobs} 
            jobDetailId={jobDetailId}
            handleViewJobDetail={handleViewJobDetail}
            isLoading={isLoading || isFetching} 
          />
        </div>
        <div className="w-1/2">
          {jobDetailId ? <JobDetail id={jobDetailId} /> : ""}
        </div>
      </div>
    </MasterLayout>
  )
}

export default Jobs
