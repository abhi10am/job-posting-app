import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import genericHelper from 'helpers/GenericHelper';

export const jobUserApplicationApi = createApi({
  reducerPath: 'jobUserApplicationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_URL}/user/job-application`,
    prepareHeaders: async (headers) => {
      headers.set('x-access-token', genericHelper.getAccessToken())
      return headers;
    }
  }),
  tagTypes: ["JobApplications"],
  endpoints: (builder) => ({
    submitJobApplication: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/submit/${id}`,
        method: "POST",
        body: formData
      }),
      invalidatesTags: ["JobApplications"]
    }),
  }),
})

export const {
  useSubmitJobApplicationMutation
} = jobUserApplicationApi