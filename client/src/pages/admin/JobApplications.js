import Card from 'components/Card'
import Loader from 'components/Loader'
import StatusTag from 'components/StatusTag'
import MasterLayout from 'components/layout/MasterLayout'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'
import { useGetJobApplicationByIdQuery, useGetJobApplicationsQuery, useUpdateJobApplicationStatusMutation } from 'store/apis/admin/job-application'
import Button from 'components/form/Button'
import { toast } from 'react-toastify'
import FormikTextarea from 'components/form/FormikTextarea'
import PageHeader from 'components/PageHeader'
import axios from 'axios'
import genericHelper from 'helpers/GenericHelper'
import { HiArrowDownTray } from "react-icons/hi2"

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
                <Button variant="primary" type="submit" disabled={isSubmitting}>Submit</Button>
                <Button variant="link" type="button" onClick={() => setIsRejecting(false)}>Cancel</Button>
              </div>
            </Form>
          )}
        </Formik>
      : <div>
          {data.status === "PENDING" 
            ? <div className="flex items-center space-x-2">
                <Button variant="success-soft" onClick={() => handleUpdateStatus({ status: "APPROVED" })} className="w-full">Approve Application</Button>
              <Button variant="danger-soft" onClick={() => setIsRejecting(true)} className="w-full">Reject Application</Button>
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

  const downloadResume = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/admin/job-application/${id}/download-resume`, {
        headers: {
          'x-access-token': genericHelper.getAccessToken()
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Resume.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

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
        <Button 
          type="button" 
          variant="secondary"
          onClick={() => downloadResume(id)}
          className="flex items-center space-x-2 mb-8">
          <HiArrowDownTray className="text-lg" />
          <div className="text-sm">Download Resume</div>
        </Button>
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
      <PageHeader title="Job Applications"></PageHeader>
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
