import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice';
import notificationReducer from "./slices/NotificationSlice"
import userInfoReducer from "./slices/UserInfoSlice";
import userNoteReducer from "./slices/UserNoteSlice"
import feedbackReducer from "./slices/FeedbackSlice";
import postDataReducer from "./slices/PostDataSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    userInfo: userInfoReducer,
    userNote: userNoteReducer,
    feedback: feedbackReducer,
    postData: postDataReducer,
  },
});