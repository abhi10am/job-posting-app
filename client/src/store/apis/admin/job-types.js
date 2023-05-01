import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import genericHelper from 'helpers/GenericHelper';

export const jobTypeApi = createApi({
  reducerPath: 'jobTypeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_URL}/admin/job/type`,
    prepareHeaders: async (headers) => {
      headers.set('x-access-token', genericHelper.getAccessToken())
      return headers;
    }
  }),
  tagTypes: ["JobType"],
  endpoints: (builder) => ({
    getTypes: builder.query({
      query: () => "/list",
      transformResponse: (response, meta, arg) => response.data,
      providesTags: ["JobType"]
    }),
    createType: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["JobType"]
    }),
    updateType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["JobType"]
    }),
    deleteType: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["JobType"]
    }),
  }),
})

export const {
  useGetTypesQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation
} = jobTypeApi