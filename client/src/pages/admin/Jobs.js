import Card from 'components/Card'
import CustomLink from 'components/CustomLink'
import Loader from 'components/Loader'
import Button from 'components/form/Button'
import MasterLayout from 'components/layout/MasterLayout'
import React, { useEffect, useRef, useState } from 'react'
import { useGetJobByIdQuery, useGetJobsQuery } from 'store/apis/admin/job'
import { JobList } from 'components/job/JobList'
import PageHeader from 'components/PageHeader'
import Modal from 'components/Modal'
import useWindowWidth from 'hooks/windowWidth'
import JobContent from 'components/job/JobContent'
import NoDataFound from 'components/NoDataFound'


const JobDetail = ({ id, useModal, isOpen, setIsOpen }) => {
  const { data, isLoading, isFetching } = useGetJobByIdQuery(id);

  if (isLoading || isFetching) return <Loader />

  if (!data && !isLoading && !isFetching) {
    return <div className="flex items-center justify-center">No data found</div>
  }

  return (
    useModal 
      ? <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="View Job"><JobContent data={data} /></Modal>
      : <Card><JobContent data={data} /></Card>
  )
}

const Jobs = () => {
  const { data: jobs, isLoading, isFetching } = useGetJobsQuery();
  const [jobDetailId, setJobDetailId] = useState(null);
  const [useModal, setUseModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const jobDetailIdRef = useRef(jobDetailId);

  useEffect(() => {
    if ((windowWidth < 1024)) {
      setUseModal(true);
      setIsOpen(jobDetailIdRef.current !== null);
    }
    else if (jobs) {
      setUseModal(false);
      setIsOpen(false);
      setJobDetailId(jobs[0].id);
    }
  }, [windowWidth, jobDetailIdRef, jobs]);

  useEffect(() => {
    jobDetailIdRef.current = jobDetailId;
  }, [jobDetailId]);

  useEffect(() => {
    if (!isOpen) setJobDetailId(null);
  }, [isOpen]);

  useEffect(() => {
    if ((windowWidth > 1024) && jobs) setJobDetailId(jobs[0].id);
  }, [jobs, windowWidth]);

  const handleViewJobDetail = (id) => {
    setJobDetailId(id);
  }

  return (
    <MasterLayout>
      <PageHeader 
        title="All Jobs" 
        actions={<CustomLink to="/admin/jobs/create"><Button type="button">Post New Job</Button></CustomLink>}
      ></PageHeader>
      {!isLoading && !jobs
        ? <NoDataFound />
        : <div className="lg:flex space-y-2 lg:space-x-2 lg:space-y-0">
          <div className="lg:w-1/2">
            <JobList 
              jobs={jobs} 
              jobDetailId={jobDetailId}
              handleViewJobDetail={handleViewJobDetail}
              isLoading={isLoading || isFetching} 
              onItemClick={() => setIsOpen(true)}
            />
          </div>
          <div className="lg:w-1/2">
            {jobDetailId 
              ? <JobDetail 
                  id={jobDetailId} 
                  useModal={useModal} 
                  isOpen={isOpen} 
                  setIsOpen={setIsOpen} 
                />
              : ""}
          </div>
        </div>}
    </MasterLayout>
  )
}

export default Jobs
