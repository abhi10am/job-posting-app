import Card from 'components/Card'
import Loader from 'components/Loader'
import PageTitle from 'components/PageTitle'
import StatusTag from 'components/StatusTag'
import MasterLayout from 'components/layout/MasterLayout'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'
import { useGetJobApplicationByIdQuery, useGetJobApplicationsQuery, useUpdateJobApplicationStatusMutation } from 'store/apis/admin/job-application'
import Button from 'components/form/Button'
import { toast } from 'react-toastify'
import FormikTextarea from 'components/form/FormikTextarea'

const JobApplicationAction = ({ data }) => {
  const [updateApplicationStatus] = useUpdateJobApplicationStatusMutation();
  const [isRejecting, setIsRejecting] = useState(false);


  const handleUpdateStatus = async (values) => {
    await updateApplicationStatus({ id: data.id, ...values })
      .unwrap()
      .then((fulfilled) => {
        toast.success(fulfilled.status.message);
        setIsRejecting(false);
      })
      .catch((rejected) => {
        if (rejected.data) {
          toast.error(rejected.data.status.message);
        }
      });
  }

  return (
    <div className="">
    {isRejecting 
      ? <Formik
          initialValues={{ rejectReason: '' }}
          onSubmit={(values) => {
            handleUpdateStatus({ status: "REJECTED", ...values });
          }}
          validationSchema={() => {
            return Yup.object({ rejectReason: Yup.string().min(2).max(100).required().label('Reason') });
          }}
        >
          {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
            <Form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <FormikTextarea name="rejectReason" id="rejectReason" rows={4} placeholder="Reason for rejection the job application" />
              <div className="flex space-x-2">
                <Button type="submit">Submit</Button>
                <Button type="button" onClick={() => setIsRejecting(false)}>Cancel</Button>
              </div>
            </Form>
          )}
        </Formik>
      : <div>
          {data.status === "PENDING" 
            ? <div className="flex items-center space-x-2">
                <Button onClick={() => handleUpdateStatus({ status: "APPROVED" })}>Approve Application</Button>
                <Button onClick={() => setIsRejecting(true)}>Reject Application</Button>
              </div>
            : ""}
        </div>
    }
    </div>
  )
}

const JobAppDetail = ({ id }) => {
  const { data, isLoading, isFetching } = useGetJobApplicationByIdQuery(id);

  if (!id || isLoading || isFetching) return <Loader />

  if (!data && !isLoading && !isFetching) {
    return <div className="flex items-center justify-center">No data found</div>
  }

  return (
    <Card className="">
      <div className="relative">
        <StatusTag status={data.status} className="absolute top-0 right-0" />
        <div className="flex items-center text-sm space-x-1">
          <div className="text-gray-600">Job:</div>
          <div className="font-medium">{data.job.title}</div>
        </div>
        <div className="flex items-center text-sm space-x-1">
          <div className="text-gray-600">Candidate:</div>
          <div className="font-medium">{data.user.name}</div>
        </div>
        <div className="flex items-center text-sm space-x-1 mb-6">
          <div className="text-gray-600">Relevancy Score:</div>
          <div className="font-medium">{data.relevancyScore}</div>
        </div>
        <button className="flex items-center space-x-2 px-2 py-1 rounded bg-gray-200 mb-8">
          <div className="text-sm">Download Resume</div>
        </button>
        <JobApplicationAction data={data} />
      </div>
    </Card>
  )
}

const JobAppListItem = ({ data, jobAppDetailId, handleViewJobAppDetail }) => {
  return (
    <Card
      className={`text-gray-800 cursor-pointer ${jobAppDetailId === data.id ? 'outline outline-2 outline-primary-600' : ''}`}
      onClick={() => handleViewJobAppDetail(data.id)}
    >
      <div className="flex items-center text-sm space-x-1">
        <div className="text-gray-600">Job:</div>
        <div className="font-medium">{data.job.title}</div>
      </div>
      <div className="flex items-center text-sm space-x-1">
        <div className="text-gray-600">Candidate:</div>
        <div className="font-medium">{data.user.name}</div>
      </div>
    </Card>
  )
}

const JobApplicationList = ({ jobApps, jobAppDetailId, handleViewJobAppDetail, isLoading }) => {
  if (isLoading) return <Loader />

  if (!isLoading && !jobApps) return (
    <div className="flex items-center justify-center">No data found</div>
  )

  return (
    <div className="space-y-2">
      {jobApps.map((jobApp) => (
        <JobAppListItem
          key={jobApp.id}
          jobAppDetailId={jobAppDetailId}
          handleViewJobAppDetail={handleViewJobAppDetail}
          data={jobApp}
        />
      ))}
    </div>
  )
}

const JobApplications = () => {
  const { data: jobApps, isLoading, isFetching } = useGetJobApplicationsQuery();
  const [jobAppDetailId, setJobAppDetailId] = useState(null);

  useEffect(() => {
    if (jobApps) setJobAppDetailId(jobApps[0].id);
  }, [jobApps]);

  const handleViewJobAppDetail = (id) => {
    setJobAppDetailId(id);
  }

  return (
    <MasterLayout>
      <div className="flex items-center justify-between mb-8">
        <PageTitle>Job Applications</PageTitle>
      </div>

      <div className="flex space-x-2">
        <div className="w-1/2">
          <JobApplicationList
            jobApps={jobApps}
            jobAppDetailId={jobAppDetailId}
            handleViewJobAppDetail={handleViewJobAppDetail}
            isLoading={isLoading || isFetching}
          />
        </div>
        <div className="w-1/2">
          {jobAppDetailId ? <JobAppDetail id={jobAppDetailId} /> : ""}
        </div>
      </div>
    </MasterLayout>
  )
}

export default JobApplications
