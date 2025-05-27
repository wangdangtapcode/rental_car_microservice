// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Thử lấy user từ localStorage nếu có
const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: storedUser || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // 👉 lưu vào localStorage
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // 👉 xoá khỏi localStorage khi logout
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
