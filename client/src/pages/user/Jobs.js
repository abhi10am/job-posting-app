import Card from 'components/Card'
import Loader from 'components/Loader'
import MasterLayout from 'components/layout/MasterLayout'
import React, { useEffect, useRef, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useGetJobByIdQuery, useGetJobsQuery } from 'store/apis/user/job'
import Button from 'components/form/Button'
import FormikFileInput from 'components/form/FormikFileInput'
import InputLabel from 'components/form/InputLabel'
import { useSubmitJobApplicationMutation } from 'store/apis/user/job-application'
import { toast } from 'react-toastify'
import { JobList } from 'components/job/JobList'
import PageHeader from 'components/PageHeader'
import JobContent from 'components/job/JobContent'
import useWindowWidth from 'hooks/windowWidth'
import Modal from 'components/Modal'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import NoDataFound from 'components/NoDataFound'

const JobApplicationForm = ({ id, handleOnSubmit, handleCancel, useModal }) => {
  const FILE_SIZE = 1024 * 1024 * 2; // 2 MB
  const SUPPORTED_FORMATS = ['application/pdf'];

  const [submitJobApplication] = useSubmitJobApplicationMutation()

  const validationSchema = Yup.object({
    resume: Yup.mixed().required('Resume is required')
      .test(
        'fileSize',
        'File is too large. Maxium upload size is 2MB.',
        value => {
          return !value || value.size <= FILE_SIZE
        }
      )
      .test(
        'fileFormat',
        'Unsupported file format',
        value => value && SUPPORTED_FORMATS.includes(value.type)
      ),
  })
  
  const onSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append('resume', values.resume);
    
    await submitJobApplication({ id, formData })
      .unwrap()
      .then((fulfilled) => {
        toast.success(fulfilled.status.message);
        resetForm();
        handleOnSubmit();
      })
      .catch((rejected) => {
        if (rejected.data) {
          toast.error(rejected.data.status.message);
        }
      });
  }

  return (
    <div className="">
      <Formik
        initialValues={{ resume: '' }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, handleChange, values, errors, isSubmitting, setFieldValue }) => (
          <Form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <InputLabel htmlFor="resume">Upload Your Resume</InputLabel>
            <FormikFileInput 
              name="resume" 
              id="resume" 
              onChange={(event) => {
                setFieldValue("resume", event.currentTarget.files[0]);
              }} 
            />
            <div className="flex space-x-2">
              <Button type="submit" className="" disabled={isSubmitting}>Submit Application</Button>
              <Button type="button" variant="link" onClick={handleCancel}>Cancel</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

const JobDetail = ({ id, useModal }) => {
  const { data, isLoading, isFetching } = useGetJobByIdQuery(id);
  const [isApplied, setIsApplied] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (data) setIsApplied(data.JobApplication.length);
  }, [data]);

  if (!id || isLoading || isFetching) return <Loader />

  if (!data && !isLoading && !isFetching) {
    return <div className="flex items-center justify-center">No data found</div>
  }

  const ApplyButton = () => {
    return isApplied
      ? <div className="bg-primary-200 text-primary-600 font-medium px-4 py-2 rounded flex space-x-2 items-center">
          <HiOutlineInformationCircle className="text-xl" />
          <span>You have applied for this job</span>
        </div>
      : <Button
        type="button"
        onClick={() => {
          if (!isApplied) setIsApplying(true);
        }}
        disabled={isApplied}
      >
        Apply Now
      </Button>
  }

  return (
    <div className="space-y-8">
      <JobContent data={data} />
      {isApplying
        ? <JobApplicationForm 
            id={id} 
            useModal={useModal}
            handleOnSubmit={() => {
              setIsApplied(true);
              setIsApplying(false);
            }} 
            handleCancel={() => setIsApplying(false)} 
          />
        : <ApplyButton />
      }
    </div>
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

  const JobDetailWrapper = () => {
    return (
      useModal
        ? <Modal isOpen={ isOpen } setIsOpen={ setIsOpen } title="View Job">
            <JobDetail id={ jobDetailId } useModal={ useModal } />
          </Modal> 
        : <Card><JobDetail id={jobDetailId} useModal={useModal} /></Card>
    )
  }

  return (
    <MasterLayout>
      <PageHeader title="All Jobs"></PageHeader> 
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
                ? <JobDetailWrapper />
                : ""
              }  
            </div>
          </div>}
    </MasterLayout>
  )
}

export default Jobs
