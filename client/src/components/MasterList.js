import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from './form/Button';
import Loader from './Loader';


export const MasterNewItem = ({ handleCreate, type }) => {
  return (
    <Formik
      initialValues={{ name: '' }}
      onSubmit={(values, { resetForm }) => {
        handleCreate(values);
        resetForm();
      }}
      validationSchema={() => 
        Yup.object({
          name: Yup.string().min(2).required()
        })
      }
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form onSubmit={handleSubmit} className="flex items-stretch space-x-4 mb-4">
          <div className={`bg-white text-gray-800 p-3 w-full rounded-lg`}>
            <Field type="text" name="name" className="w-full outline-none" placeholder={`Enter job ${type.toLowerCase()}`} />
          </div>
          <Button type="button" className="whitespace-nowrap">
            Add New {type}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

const ListActionButton = ({ children, className = "", ...props }) => {
  return (
    <button className={`text-sm font-medium ${className}`} {...props}>
      {children}
    </button>
  )
}

const ListItem = ({ item, isEditing, handleEdit, handleDelete }) => {
  return (
    <div className="group bg-white text-gray-800 p-4 flex items-center justify-between first:rounded-t-lg last:rounded-b-lg">
      <div>{item.name}</div>
      <div className={`hidden items-center justify-center space-x-4 ${isEditing ? '' : 'group-hover:flex'}`}>
        <ListActionButton type="button" className="text-primary-600 hover:text-primary-800" onClick={() => handleEdit(item.id)}>Edit</ListActionButton>
        <ListActionButton type="button" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item.id)}>Delete</ListActionButton>
      </div>
    </div>
  )
}

const EditListItem = ({ item, isEditing, handleUpdate, handleCancelEdit }) => {
  return (
    <Formik
      initialValues={{ name: item.name }}
      onSubmit={(values) => handleUpdate(item.id, values)}
      validationSchema={() => 
        Yup.object({
          name: Yup.string().min(2).required()
        })
      }
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <div className={`bg-white text-gray-800 p-4 flex items-center justify-between space-x-2 first:rounded-t-lg last:rounded-b-lg ${isEditing ? 'outline outline-2 outline-primary-600' : ''}`}>
            <Field type="text" name="name" className="w-full outline-none" />
            <div className="flex items-center justify-center space-x-4">
              <ListActionButton type="submit" className="text-primary-600 hover:text-primary-800" disabled={isSubmitting}>Update</ListActionButton>
              <ListActionButton type="button" className="text-gray-600 hover:text-gray-800" onClick={handleCancelEdit}>Cancel</ListActionButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

const MasterList = ({ items, isLoading, handleUpdate, handleDelete }) => {
  const [editItemId, setEditItemId] = useState(null);

  const handleCancelEdit = () => setEditItemId(null);

  if (isLoading) return <Loader />

  if (!isLoading && !items) return (
    <div className="flex items-center justify-center">No data found</div>
  )

  return (
    <div className="space-y-[2px]">
      {items.map((item) => (
        (item.id === editItemId)
          ? <EditListItem 
              key={item.id}
              item={item}
              isEditing={editItemId}
              handleUpdate={(id, values) => {
                handleUpdate(id, values);
                setEditItemId(null);
              }}
              handleCancelEdit={handleCancelEdit}
            />
          : <ListItem 
              key={item.id} 
              item={item} 
              isEditing={editItemId}
              handleEdit={setEditItemId}
              handleDelete={handleDelete} 
            />
        ))
      }
    </div>
  )
}

export default MasterList
