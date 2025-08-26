import { authApi } from '@/features/api/authApi'
import authReducer from  '../features/authSlice'
import { combineReducers } from '@reduxjs/toolkit'
import { courseApi } from '@/features/api/courseApi'
import { purchaseApi } from '@/features/api/purchaseApi'
import { courseProgressApi } from '@/features/api/courseProgressApi'
import { reviewApi } from '@/features/api/reviewApi'
import { fileAssignmentApi } from '@/features/api/fileAssignmentApi'
import { quizAssignmentApi } from '@/features/api/quizAssignmentApi'
import { submissionApi } from '@/features/api/submissionApi'

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [purchaseApi.reducerPath]:purchaseApi.reducer,
    [courseProgressApi.reducerPath]:courseProgressApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [fileAssignmentApi.reducerPath]: fileAssignmentApi.reducer,
    [quizAssignmentApi.reducerPath]: quizAssignmentApi.reducer,
    [submissionApi.reducerPath]: submissionApi.reducer,
    auth:authReducer
})

export default rootReducer