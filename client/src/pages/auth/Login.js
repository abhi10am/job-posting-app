import CustomLink from 'components/CustomLink'
import Button from 'components/form/Button'
import FormikInput from 'components/form/FormikInput'
import InputLabel from 'components/form/InputLabel'
import React from 'react'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from 'contexts/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const initialValues = { email: '', password: '' };
  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const onSubmit = async (values) => {
    const loginResult = await login(values.email, values.password);
    if (loginResult.status) {
      navigate(loginResult.redirect);
    }
    else {
      toast.error(loginResult.message);
    }
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
              Login to your account
            </h1>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
                <Form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <FormikInput type="email" name="email" id="email" placeholder="example@domain.com" />
                  </div>
                  <div>
                    <InputLabel>Password</InputLabel>
                    <FormikInput type="password" name="password" id="password" placeholder="••••••••" />
                  </div>
                  <div className="flex items-center justify-end">
                    <CustomLink to="/forgot-password" className="font-medium">Forgot password?</CustomLink>
                  </div>
                  <Button type="submit" className="w-full">Login</Button>
                  <p className="text-sm font-light text-gray-500">
                    Are you a new user? <CustomLink to="/register" className="font-medium">Sign up here</CustomLink>
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

export default Login
