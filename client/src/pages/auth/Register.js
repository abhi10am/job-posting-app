import CustomLink from 'components/CustomLink'
import Button from 'components/form/Button'
import FormikInput from 'components/form/FormikInput'
import InputLabel from 'components/form/InputLabel'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import React from 'react'
import { useRegisterMutation } from 'store/apis/auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import FormikSelect from 'components/form/FormikSelect'


const Register = () => {
  const navigate = useNavigate();
  const [register] = useRegisterMutation();

  const initialValues = { 
    name: '',
    email: '',
    phone: '',
    password: '', 
    confirmPassword: '',
    role: ''
  };
  const validationSchema = Yup.object({
    name: Yup.string().min(2).max(20).required().label('Full Name'),
    email: Yup.string().email().required().label('Email'),
    phone: Yup.string().min(10).max(10).required().label('Phone'),
    password: Yup.string().min(8).max(50).required().label('Password'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password and Confirm Password must match').required().label('Confirm Password'),
    role: Yup.string().required().label('Role')
  });

  const onSubmit = async (values) => {
    await register(values)
      .unwrap()
      .then((fulfilled) => {
        toast.success(fulfilled.status.message);
        navigate('/login');
      })
      .catch((rejected) => {
        if (rejected.data) {
          toast.error(rejected.data.status.message);
        }
      });
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <div className="w-full sm:max-w-md">
        <div className="text-center mb-6 text-2xl font-semibold text-gray-900">
          Jobs Posting App
        </div>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Create an account
            </h1>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
                <Form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div>
                    <InputLabel htmlFor="name">Full Name</InputLabel>
                    <FormikInput type="text" name="name" id="name" placeholder="John Doe" />
                  </div>
                  <div>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <FormikInput type="email" name="email" id="email" placeholder="example@domain.com" />
                  </div>
                  <div>
                    <InputLabel htmlFor="phone">Phone</InputLabel>
                    <FormikInput type="text" name="phone" id="phone" placeholder="1234567890" />
                  </div>
                  <div>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <FormikInput type="password" name="password" id="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                    <FormikInput type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••" />
                  </div>
                  <div>
                    <InputLabel htmlFor="role">Select Your Role</InputLabel>
                    <FormikSelect name="role" id="role" as="select">
                      <option value="">Select role</option>
                      <option value="ADMIN">Admin</option>
                      <option value="USER">Candidate</option>
                    </FormikSelect>
                  </div>
                  <Button type="submit" className="w-full">Create an account</Button>
                  <p className="text-sm font-light text-gray-500">
                    Already have an account? <CustomLink to="/login" className="font-medium">Login here</CustomLink>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
