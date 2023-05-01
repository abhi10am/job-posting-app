import CustomLink from 'components/CustomLink'
import Button from 'components/form/Button'
import FormikInput from 'components/form/FormikInput'
import InputLabel from 'components/form/InputLabel'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useResetPasswordMutation } from 'store/apis/auth'
import { toast } from 'react-toastify'

const ResetPassword = (props) => {
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();
  const { token } = useParams();

  const initialValues = { password: '', confirmPassword: '' };
  const validationSchema = Yup.object({
    password: Yup.string().min(8).max(50).required().label('Password'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password and Confirm Password must match').required().label('Confirm Password')
  });

  const onSubmit = async (values) => {
    await resetPassword({ token, ...values })
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
              Change Password
            </h1>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
                <Form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div>
                    <InputLabel>Password</InputLabel>
                    <FormikInput type="password" name="password" id="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <InputLabel>Confirm Password</InputLabel>
                    <FormikInput type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••" />
                  </div>
                  <Button type="submit" className="w-full">Reset password</Button>
                  <p className="text-sm font-light text-gray-500">
                    Return back to <CustomLink to="/login">Login</CustomLink>
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

export default ResetPassword
