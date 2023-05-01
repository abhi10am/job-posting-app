import Card from 'components/Card'
import Loader from 'components/Loader'
import PageTitle from 'components/PageTitle'
import Separator from 'components/Separator'
import MasterLayout from 'components/layout/MasterLayout'
import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useGetJobByIdQuery, useGetJobsQuery } from 'store/apis/user/job'
import Button from 'components/form/Button'
import FormikFileInput from 'components/form/FormikFileInput'
import InputLabel from 'components/form/InputLabel'
import { useSubmitJobApplicationMutation } from 'store/apis/user/job-application'
import { toast } from 'react-toastify'
import { JobList } from 'components/job/JobList'

const JobApplicationForm = ({ id, handleOnSubmit, handleCancel }) => {
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
    <div className="bg-primary-100 -m-4 p-4 rounded-b-lg">
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
              <Button type="submit" className="">Submit Application</Button>
              <Button type="button" onClick={handleCancel}>Cancel</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

const JobDetail = ({ id }) => {
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
      <div className="flex items-center flex-wrap space-x-1 mb-8">
        <div className="text-sm text-gray-600 mr-2">Tags</div>
        {data.tags.split(', ').map((item, index) => (
          <div key={index} className="px-2 py-1 bg-gray-200 text-xs rounded">{item}</div>
        ))}
      </div>
      {isApplying
        ? <JobApplicationForm 
            id={id} 
            handleOnSubmit={() => {
              setIsApplied(true);
              setIsApplying(false);
            }} 
            handleCancel={() => setIsApplying(false)} 
          />
        : <Button 
            type="button" 
            onClick={() => {
              if(!isApplied) setIsApplying(true);
            }}
            disabled={isApplied}
          >
            {isApplied ? "Applied" : "Apply Now" }
          </Button>
      }
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
