import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
  email: null,
  userName: null,
  userID: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      const { email, userName, userID } = action.payload;
      state.email = email;
      state.userName = userName;
      state.userID = userID;
    },
    removeActiveUser(state) {
      state.email = null;
      state.userName = null;
      state.userID = null;
    },
  },
});

export const { setActiveUser, removeActiveUser } = authSlice.actions;

export default authSlice.reducer;
