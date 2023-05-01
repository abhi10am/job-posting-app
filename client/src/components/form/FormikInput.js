import { ErrorMessage, Field } from 'formik'
import React from 'react'

const FormikInput = ({ className = "", ...props }) => {
  return (
    <div>
      <Field
        className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 ${className}`}
        {...props}
      />
      <ErrorMessage name={props.name} component="div" className="text-xs text-red-600" />
    </div>
  )
}

export default FormikInput
