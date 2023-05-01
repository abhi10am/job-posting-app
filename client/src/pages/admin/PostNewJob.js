import Card from 'components/Card'
import PageTitle from 'components/PageTitle'
import Button from 'components/form/Button'
import FormikSelect from 'components/form/FormikSelect'
import InputLabel from 'components/form/InputLabel'
import MasterLayout from 'components/layout/MasterLayout'
import React from 'react'
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useGetCategoriesQuery } from 'store/apis/admin/job-categories'
import { useGetTypesQuery } from 'store/apis/admin/job-types'
import { useCreateJobMutation } from 'store/apis/admin/job'
import { toast } from 'react-toastify'
import FormikInput from 'components/form/FormikInput'
import FormikTextarea from 'components/form/FormikTextarea'

const RowInput = (props) => {
  return (
    <Field className="bg-gray-200 p-2 rounded-lg outline-none w-full" {...props} />
  )
}

const AdditionalDetailsRow = ({ index, item, remove }) => {
  return (
    <div className="flex items-center space-x-1">
      <RowInput
        id={`additionalDetails.${index}.key`}
        name={`additionalDetails.${index}.key`}
        type="text"
        value={item.key}
        placeholder="Key"
      />
      <RowInput
        id={`additionalDetails.${index}.value`}
        name={`additionalDetails.${index}.value`}
        type="text"
        value={item.value}
        placeholder="Value"
      />
      <Button type="button" className="bg-red-200 !text-red-600 hover:bg-red-300 focus:ring-0 h-10 min-w-[91px]" onClick={() => remove(index)}>
        Remove
      </Button>
      <ErrorMessage name={`additionalDetails.${index}.key`} component="div" className="text-xs text-red-600" />
    </div>
  )
}

const PostNewJob = () => {
  const { data: categories } = useGetCategoriesQuery();
  const { data: types } = useGetTypesQuery();
  const [createJob] = useCreateJobMutation();

  const initialValues = {
    title: '',
    companyName: '',
    tags: '',
    skills: '',
    experience: '',
    description: '',
    salary: '',
    category: '',
    type: '',
    additionalDetails: [],
  };

  const detailsValidationSchema = Yup.object({
    key: Yup.string().min(2).max(100).required().label('Key'),
    value: Yup.string().min(2).max(100).required().label('Value'),
  });
  const validationSchema = Yup.object({
    title: Yup.string().min(2).max(50).required().label('Title'),
    companyName: Yup.string().min(2).max(50).required().label('Company Name'),
    tags: Yup.string().required().label('Tags'),
    skills: Yup.string().required().label('Skills'),
    experience: Yup.string().required().label('Experience'),
    description: Yup.string().max(1000).required().label('Description'),
    salary: Yup.string().required().label('Salary'),
    category: Yup.string().required().label('Job Category'),
    type: Yup.string().required().label('Job Type'),
    additionalDetails: Yup.array().of(detailsValidationSchema).label('Additional Details'),
  });

  const onSubmit = async (values, { resetForm }) => {
    await createJob(values)
      .unwrap()
      .then((fulfilled) => {
        toast.success(fulfilled.status.message);
        resetForm();
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
        <PageTitle>Post New Job</PageTitle>
      </div>
      
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
          <Form onSubmit={handleSubmit} className="space-y-6">
            <Card className="space-y-4">
              <div className="flex space-x-4">
                <div className="space-y-4 w-1/2">
                  <div>
                    <InputLabel htmlFor="title">Job Title</InputLabel>
                    <FormikInput type="text" name="title" id="title" placeholder="e.g. ReactJS Developer" />
                  </div>
                  <div>
                    <InputLabel htmlFor="companyName">Company Name</InputLabel>
                    <FormikInput type="text" name="companyName" id="companyName" placeholder="XYZ Technologies" />
                  </div>
                  <div>
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <FormikTextarea name="description" id="description" rows="5" className="resize-none" placeholder="" />
                  </div>
                </div>
                <div className="space-y-4 w-1/2">
                  <div className="flex items-center space-x-4">
                    <div className="w-full">
                      <InputLabel htmlFor="category">Job Category</InputLabel>
                      <FormikSelect name="category" id="category" as="select">
                        <option value="">Select job category</option>
                        {categories?.map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </FormikSelect>
                    </div>
                    <div className="w-full">
                      <InputLabel htmlFor="type">Job Type</InputLabel>
                      <FormikSelect name="type" id="type" as="select">
                        <option value="">Select job type</option>
                        {types?.map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </FormikSelect>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-full">
                      <InputLabel htmlFor="experience">Experience Required</InputLabel>
                      <FormikInput type="text" name="experience" id="experience" placeholder="e.g. 2 years" />
                    </div>
                    <div className="w-full">
                      <InputLabel htmlFor="salary">Salary</InputLabel>
                      <FormikInput type="text" name="salary" id="salary" placeholder="e.g. 15k - 20k per month" />
                    </div>
                  </div>
                  <div>
                    <InputLabel htmlFor="tags">Tags</InputLabel>
                    <FormikInput type="text" name="tags" id="tags" placeholder="Enter comma separated values, e.g. HTML, css, JavaScript" />
                  </div>
                  <div>
                    <InputLabel htmlFor="skills">Skills Required</InputLabel>
                    <FormikInput type="text" name="skills" id="skills" placeholder="Enter comma separated values, e.g. PHP, Laravel, Java" />
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <FieldArray name="additionalDetails">
                  {({ push, remove }) => (
                    <div className="space-y-1 mr-2">
                      <div className="flex items-center justify-between mb-2">
                        <InputLabel htmlFor="additionalDetails">Additional Details</InputLabel>
                        <Button type="button" className="" onClick={() => push({ key: '', value: '' })}>
                          Add Item
                        </Button>
                      </div>
                      {values.additionalDetails.map((item, index) => (
                        <AdditionalDetailsRow key={index} index={index} item={item} remove={remove} />
                      ))}
                    </div>
                  )}
                </FieldArray>
              </div>

            </Card>
            <Button type="submit" className="float-right">Submit Job Post</Button>
          </Form>
        )}
      </Formik>
    </MasterLayout>
  )
}

export default PostNewJob
