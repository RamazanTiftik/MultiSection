import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice';
import notificationReducer from "./slices/NotificationSlice"
import userInfoReducer from "./slices/UserInfoSlice";
import userNoteReducer from "./slices/UserNoteSlice"
import feedbackReducer from "./slices/FeedbackSlice";
import postDataReducer from "./slices/PostDataSlice";
import homePageReducer from "./slices/HomePageSlice";
import targetPlannerReducer from "./slices/pluginSlice/TargetPlannerSlice";
import aiAnalysisReducer from "./slices/pluginSlice/AiAnalysisSlice";
import themeReducer from "./slices/ThemeSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    userInfo: userInfoReducer,
    userNote: userNoteReducer,
    feedback: feedbackReducer,
    postData: postDataReducer,
    homePage: homePageReducer,
    targetPlanner: targetPlannerReducer,
    aiAnalysis: aiAnalysisReducer,
    theme: themeReducer
  },
});