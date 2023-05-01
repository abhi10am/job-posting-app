import MasterList, { MasterNewItem } from 'components/MasterList'
import PageTitle from 'components/PageTitle'
import MasterLayout from 'components/layout/MasterLayout'
import React from 'react'
import { toast } from 'react-toastify'
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from 'store/apis/admin/job-categories'

const JobCategories = () => {
  // const items = ["Human Resources", "Sales", "Management", "Marketing", "Engineer", "Computer Programmer", "Electrician"];

  const { data: categories, isLoading, isFetching } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreate = async (name) => {
    await createCategory(name)
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
    await updateCategory({ id, ...values })
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
    await deleteCategory(id)
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
      <div className="flex items-center justify-between mb-8">
        <PageTitle>Job Categories</PageTitle>
      </div>
      
      <div className="">
        <MasterNewItem handleCreate={handleCreate} type="Category" />
        <MasterList
          items={categories}
          isLoading={isLoading || isFetching}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      </div>
    </MasterLayout>
  )
}

export default JobCategories
