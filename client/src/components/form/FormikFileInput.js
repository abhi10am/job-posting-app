import { ErrorMessage, Field } from 'formik'
import React from 'react'

const FormikFileInput = (props) => {
  return (
    <div>
      <label className="block">
        <span className="sr-only">Choose profile photo</span>
        <Field name="file">
          {({ field }) => (
            <input type="file" className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary-50 file:text-primary-700 cursor-pointer"
              {...field}
              {...props}
            />
          )}
        </Field>
      </label>
      <ErrorMessage name={props.name} component="div" className="text-xs text-red-600" />
    </div>
  )
}

export default FormikFileInput
