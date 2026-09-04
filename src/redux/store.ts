import { configureStore } from "@reduxjs/toolkit";
import auth from "./features/auth";
import theme from "./features/theme";
import profile from "./features/profile";
import chat from "./features/chat";
import posts from "./features/posts";
import friends from "./features/friends";
export const store = configureStore({
  reducer: {
    auth,
    theme,
    profile,
    chat,
    posts,
    friends,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
