import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API for file assignments
const ASSIGNMENTS_API = "http://localhost:3005/api/v1/file-assignments";
export const fileAssignmentApi = createApi({
  reducerPath: 'fileAssignmentApi',
  baseQuery: fetchBaseQuery({ baseUrl: ASSIGNMENTS_API,  credentials: "include" }),
  endpoints: (builder) => ({
    fetchFileAssignments: builder.query({
      query: (courseId) => `/${courseId}`,
    }),
    fetchAllFileAssignmentsForInstructor: builder.query({
      query: () => `/instructor/all`, // Call the new route to fetch all file assignments for the instructor
    }),
    fetchFileAssignmentById: builder.query({
      query: (assignmentId) => `/single/${assignmentId}`, // adjust this route as per backend
    }),
    
    createFileAssignment: builder.mutation({
      query: ({ courseId, data }) => ({
        url: `/${courseId}`,
        method: 'POST',
        body: data,
      }),
    }),
    editFileAssignment: builder.mutation({
      query: ({ courseId, assignmentId, data }) => ({
        url: `/${courseId}/${assignmentId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteFileAssignment: builder.mutation({
      query: ({ courseId, assignmentId }) => ({
        url: `/${courseId}/${assignmentId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchFileAssignmentsQuery,
  useCreateFileAssignmentMutation,
  useEditFileAssignmentMutation,
  useDeleteFileAssignmentMutation,
  useFetchAllFileAssignmentsForInstructorQuery,
  useFetchFileAssignmentByIdQuery
} = fileAssignmentApi;
