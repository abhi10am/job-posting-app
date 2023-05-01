import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import genericHelper from 'helpers/GenericHelper'

export const jobAdminApi = createApi({
  reducerPath: 'jobAdminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_URL}/admin/job`,
    prepareHeaders: async (headers) => {      
      headers.set('x-access-token', genericHelper.getAccessToken())
      return headers;
    }
  }),
  tagTypes: ["Jobs"],
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => "/list",
      transformResponse: (response, meta, arg) => response.data,
      providesTags: ["Jobs"]
    }),
    getJobById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response, meta, arg) => response.data,
      providesTags: ["Jobs"]
    }),
    createJob: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Jobs"]
    }),
  }),
})

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation
} = jobAdminApi