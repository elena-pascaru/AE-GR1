// client/src/api/user.routes.js
import { axiosNoAuth } from "../axios/axiosNoAuth";
import { axiosAuth } from "../axios/axiosAuth";


// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axiosNoAuth.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    return error.response?.data;
  }
};

// GET user by ID (for the Profile Page)
export const getUserProfile = async (id) => {
  try {
    const response = await axiosAuth.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return error.response?.data;
  }
};

// UPDATE user 
export const updateUserProfile = async (id, name) => {
  try {
    const response = await axiosAuth.put(`/users/${id}`, { name });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    return error.response?.data;
  }
};
