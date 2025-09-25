import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCategories = () => api.get("/category");
export const upsertCategory = (payload) => api.post("/category", payload);
export const deleteCategory = (id) => api.delete(`/category/${id}`);
export const deleteSubCategory = (mainId, subId) =>
  api.delete(`/category/${mainId}/sub/${subId}`);

export default api;
