import CustomLink from 'components/CustomLink'
import Button from 'components/form/Button'
import FormikInput from 'components/form/FormikInput'
import InputLabel from 'components/form/InputLabel'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForgotPasswordMutation } from 'store/apis/auth'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword] = useForgotPasswordMutation();

  const initialValues = { email: '' };
  const validationSchema = Yup.object({
    email: Yup.string().email().required()
  });

  const onSubmit = async (values) => {
    await forgotPassword(values)
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
              Reset Password
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
                    <FormikInput type="email" name="email" id="email" placeholder="example@domain.com" required />
                  </div>
                  <Button type="submit" className="w-full">Send reset password email</Button>
                  <p className="text-sm font-light text-gray-500">
                    Return back to <CustomLink to="/login" className="font-medium">Login</CustomLink>
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

export default ForgotPassword
