import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
import { reviewApi } from "@/features/api/reviewApi";
import { fileAssignmentApi } from "@/features/api/fileAssignmentApi";
import { quizAssignmentApi } from "@/features/api/quizAssignmentApi";
import { submissionApi } from "@/features/api/submissionApi";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(
      authApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware,
      courseProgressApi.middleware,
      reviewApi.middleware,
      fileAssignmentApi.middleware,
      quizAssignmentApi.middleware,
      submissionApi.middleware
    ),
});
const initializeApp = async () => {
  await appStore.dispatch(
    authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
};
initializeApp();
