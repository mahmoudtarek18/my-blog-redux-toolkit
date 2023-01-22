import { configureStore } from "@reduxjs/toolkit";
import auth from "./slice/authSlice";
import posts from "./slice/postsSlice";

const store = configureStore({
  reducer: {
    auth,
    posts,
  },
});

export default store;

export type ApplicationState = ReturnType<typeof store.getState>;
export type ApplicationDispatch = typeof store.dispatch;
