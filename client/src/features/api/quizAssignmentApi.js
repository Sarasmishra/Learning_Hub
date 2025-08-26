import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API for quiz assignments
const QUIZ_ASSIGNMENTS_API = "http://localhost:3005/api/v1/quiz-assignments"
export const quizAssignmentApi = createApi({
  reducerPath: 'quizAssignmentApi',
  baseQuery: fetchBaseQuery({ baseUrl: QUIZ_ASSIGNMENTS_API,  credentials: "include" }),
  endpoints: (builder) => ({
    fetchQuizAssignments: builder.query({
      query: (courseId) => `/${courseId}`,
    }),
    fetchAllQuizAssignmentsForInstructor: builder.query({
      query: () => `/instructor/all`, // Call the new route to fetch all quiz assignments for the instructor
    }),
    fetchQuizAssignmentById: builder.query({
      query: (assignmentId) => `/single/${assignmentId}`, // adjust this route as per backend
    }),
    
    createQuizAssignment: builder.mutation({
      query: ({ courseId, data }) => ({
        url: `/${courseId}`,
        method: 'POST',
        body: data,
      }),
    }),
    editQuizAssignment: builder.mutation({
      query: ({ courseId, assignmentId, data }) => ({
        url: `/${courseId}/${assignmentId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteQuizAssignment: builder.mutation({
      query: ({ courseId, assignmentId }) => ({
        url: `/${courseId}/${assignmentId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchQuizAssignmentsQuery,
  useCreateQuizAssignmentMutation,
  useEditQuizAssignmentMutation,
  useDeleteQuizAssignmentMutation,
  useFetchAllQuizAssignmentsForInstructorQuery,
  useFetchQuizAssignmentByIdQuery

} = quizAssignmentApi;
