import MasterList, { MasterNewItem } from 'components/MasterList';
import PageHeader from 'components/PageHeader';
import MasterLayout from 'components/layout/MasterLayout'
import React from 'react'
import { toast } from 'react-toastify';
import { useCreateTypeMutation, useDeleteTypeMutation, useGetTypesQuery, useUpdateTypeMutation } from 'store/apis/admin/job-types';

const JobTypes = () => {
  // const items = ["Full-time", "Part-time", "Temporary", "Contract", "Freelance"];

  const { data: types, isLoading, isFetching } = useGetTypesQuery();
  const [createType] = useCreateTypeMutation();
  const [updateType] = useUpdateTypeMutation();
  const [deleteType] = useDeleteTypeMutation();

  const handleCreate = async (name) => {
    await createType(name)
      .unwrap()
      .then((fulfilled) => {
        toast.success(fulfilled.status.message);
      })
      .catch((rejected) => {
        if (rejected.data) {
          toast.error(rejected.data.status.message);
        }
      });
  }

  const handleUpdate = async (id, values) => {
    await updateType({ id, ...values })
      .unwrap()
      .then((fulfilled) => {
        toast.success(fulfilled.status.message);
      })
      .catch((rejected) => {
        if (rejected.data) {
          toast.error(rejected.data.status.message);
        }
      });
  }

  const handleDelete = async (id) => {
    await deleteType(id)
      .unwrap()
      .then((fulfilled) => {
        toast.success(fulfilled.status.message);
      })
      .catch((rejected) => {
        if (rejected.data) {
          toast.error(rejected.data.status.message);
        }
      });
  }

  return (
    <MasterLayout>
      <PageHeader title="Job Types"></PageHeader> 
      <div className="">
        <MasterNewItem handleCreate={handleCreate} type="Type" />
        <MasterList
          items={types}
          isLoading={isLoading || isFetching}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      </div>
    </MasterLayout>
  )
}

export default JobTypes
