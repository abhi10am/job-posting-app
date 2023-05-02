import Card from 'components/Card'
import Loader from 'components/Loader'
import StatusTag from 'components/StatusTag'
import MasterLayout from 'components/layout/MasterLayout'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import React, { useEffect, useRef, useState } from 'react'
import { useGetJobApplicationByIdQuery, useGetJobApplicationsQuery, useUpdateJobApplicationStatusMutation } from 'store/apis/admin/job-application'
import Button from 'components/form/Button'
import { toast } from 'react-toastify'
import FormikTextarea from 'components/form/FormikTextarea'
import PageHeader from 'components/PageHeader'
import axios from 'axios'
import genericHelper from 'helpers/GenericHelper'
import { HiArrowDownTray } from "react-icons/hi2"
import Modal from 'components/Modal'
import useWindowWidth from 'hooks/windowWidth'
import NoDataFound from 'components/NoDataFound'

const JobApplicationAction = ({ data }) => {
  const [updateApplicationStatus] = useUpdateJobApplicationStatusMutation();
  const [isRejecting, setIsRejecting] = useState(false);

  if (data.status !== "PENDING") return "";

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
      : <div className="flex items-center space-x-2">
          <Button variant="success-soft" onClick={() => handleUpdateStatus({ status: "APPROVED" })} className="w-full">Approve Application</Button>
          <Button variant="danger-soft" onClick={() => setIsRejecting(true)} className="w-full">Reject Application</Button>
        </div>
    }
    </div>
  )
}

const JobAppContent = ({ data, isLoading }) => {
  if (isLoading) return <Loader />

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
      toast.error("Failed to download resume. Please try again later.");
      console.error(error);
    }
  };

  return (
    <div className="relative">
      <StatusTag status={data.status} className="absolute top-0 right-0" />
      <div className="space-y-2 mb-8">
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
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => downloadResume(data.id)}
        className="flex items-center space-x-2 mb-8">
        <HiArrowDownTray className="text-lg" />
        <div className="text-sm">Download Resume</div>
      </Button>
      <JobApplicationAction data={data} />
    </div>
  )
}

const JobAppDetail = ({ id, useModal, isOpen, setIsOpen }) => {
  const { data, isLoading, isFetching } = useGetJobApplicationByIdQuery(id);

  if (isLoading || isFetching) return <Loader />

  if (!data && !isLoading && !isFetching) {
    return <div className="flex items-center justify-center">No data found</div>
  }

  return (
    useModal
      ? <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Job Application">
          <JobAppContent data={data} isLoading={isLoading || isFetching} />
        </Modal>
      : <Card>
          <JobAppContent data={data} isLoading={isLoading || isFetching} />
        </Card>
  )
}

const JobAppListItem = ({ data, jobAppDetailId, handleViewJobAppDetail, onItemClick }) => {
  return (
    <Card
      className={`text-gray-800 cursor-pointer space-y-1 ${jobAppDetailId === data.id ? 'outline outline-2 outline-primary-600' : ''}`}
      onClick={() => {
        handleViewJobAppDetail(data.id);
        onItemClick();
      }}
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

const JobApplicationList = ({ jobApps, jobAppDetailId, handleViewJobAppDetail, isLoading, onItemClick }) => {
  if (isLoading) return <Loader />

  return (
    <div className="space-y-2">
      {jobApps.map((jobApp) => (
        <JobAppListItem
          key={jobApp.id}
          jobAppDetailId={jobAppDetailId}
          handleViewJobAppDetail={handleViewJobAppDetail}
          data={jobApp}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  )
}

const JobApplications = () => {
  const { data: jobApps, isLoading, isFetching } = useGetJobApplicationsQuery();
  const [jobAppDetailId, setJobAppDetailId] = useState(null);
  const [useModal, setUseModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const jobAppDetailIdRef = useRef(jobAppDetailId);

  useEffect(() => {
    if ((windowWidth < 1024)) {
      setUseModal(true);
      setIsOpen(jobAppDetailIdRef.current !== null);
    }
    else if (jobApps) {
      setUseModal(false);
      setIsOpen(false);
      setJobAppDetailId(jobApps[0].id);
    }
  }, [windowWidth, jobAppDetailIdRef, jobApps]);

  useEffect(() => {
    jobAppDetailIdRef.current = jobAppDetailId;
  }, [jobAppDetailId]);

  useEffect(() => {
    if (!isOpen) setJobAppDetailId(null);
  }, [isOpen]);

  useEffect(() => {
    if ((windowWidth > 1024) && jobApps) setJobAppDetailId(jobApps[0].id);
  }, [jobApps, windowWidth]);

  const handleViewJobAppDetail = (id) => {
    setJobAppDetailId(id);
  }

  return (
    <MasterLayout>
      <PageHeader title="Job Applications"></PageHeader>
      {!isLoading && !jobApps
        ? <NoDataFound />
        : <div className="lg:flex space-y-2 lg:space-x-2 lg:space-y-0">
            <div className="lg:w-1/2">
              <JobApplicationList
                jobApps={jobApps}
                jobAppDetailId={jobAppDetailId}
                handleViewJobAppDetail={handleViewJobAppDetail}
                isLoading={isLoading || isFetching}
                onItemClick={() => setIsOpen(true)}
              />
            </div>
            <div className="lg:w-1/2">
              {jobAppDetailId
                ? <JobAppDetail
                  id={jobAppDetailId}
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

export default JobApplications
