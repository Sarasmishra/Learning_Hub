import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL for your API
const REVIEW_API = "http://localhost:3005/api/v1/review";

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  tagTypes: ['Reviews'],
  baseQuery: fetchBaseQuery({
    baseUrl: REVIEW_API,
    credentials: 'include', // Assuming you have session-based auth, like cookies
  }),
  endpoints: (builder) => ({
    // GET reviews by courseId
    getReviewsByCourseId: builder.query({
      query: (courseId) => `/${courseId}`,  // Matches the GET /reviews/:courseId route
      providesTags: (result, error, courseId) =>
        result ? [{ type: 'Reviews', id: courseId }] : [],
    }),

    // POST review for a course
    createReview: builder.mutation({
      query: ({ courseId, rating, comment }) => ({
        url: `/${courseId}`, // Matches the POST /reviews/:courseId route
        method: 'POST',
        body: { rating, comment }, // Sending rating and comment
      }),
      // Invalidates the cache for that course's reviews when a new review is created
      invalidatesTags: (result, error, { courseId }) => [
        { type: 'Reviews', id: courseId },
      ],
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),
    
  }),
});

export const {
  useGetReviewsByCourseIdQuery,
  useCreateReviewMutation,
 useDeleteReviewMutation
} = reviewApi;
