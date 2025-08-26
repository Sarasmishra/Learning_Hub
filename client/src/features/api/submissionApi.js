import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API for submissions
const SUBMISSION_API ="http://localhost:3005/api/v1/submissions"
export const submissionApi = createApi({
  reducerPath: 'submissionApi',
  baseQuery: fetchBaseQuery({ baseUrl: SUBMISSION_API,credentials: "include"  }),
  endpoints: (builder) => ({
    submitFileAssignment: builder.mutation({
      query: ({ assignmentId, data }) => ({
        url: `/file/${assignmentId}/submit`,
        method: 'POST',
        body: data,
      }),
    }),
    submitQuiz: builder.mutation({
      query: ({ assignmentId, answers }) => ({
        url: `/quiz/${assignmentId}/submit`,
        method: 'POST',
        body: {assignmentId,answers} , // includes answers and user info
      }),
    }),
    gradeSubmission: builder.mutation({
      query: ({ submissionId, grade }) => ({
        url: `/${submissionId}/grade`,
        method: 'PUT',
        body: { grade },
      }),
    }),
  }),
});

export const {
  useSubmitFileAssignmentMutation,
  useGradeSubmissionMutation,
  useSubmitQuizMutation
} = submissionApi;
