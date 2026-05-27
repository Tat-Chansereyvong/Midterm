import axios from "axios";

const API_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function register(payload: {
  username: string;
  email: string;
  password: string;
}) {
  const res = await api.post("/auth/register", payload);
  localStorage.setItem("token", res.data.accessToken);
  return res.data;
}

export async function login(payload: { email: string; password: string }) {
  const res = await api.post("/auth/login", payload);
  localStorage.setItem("token", res.data.accessToken);
  return res.data;
}

export async function getProfile() {
  const res = await api.get("/users/me");
  return res.data;
}

export async function updateProfile(payload: { bio?: string }) {
  const res = await api.patch("/users/me", payload);
  return res.data;
}

export async function listComments(params?: any) {
  const res = await api.get("/comments", { params });
  return res.data;
}

export async function createComment(payload: {
  postId: string;
  content: string;
}) {
  const res = await api.post("/comments", payload);
  return res.data;
}

export async function updateComment(id: string, payload: { content: string }) {
  const res = await api.patch(`/comments/${id}`, payload);
  return res.data;
}

export async function deleteComment(id: string) {
  const res = await api.delete(`/comments/${id}`);
  return res.data;
}

export async function likeComment(id: string) {
  const res = await api.post(`/comments/${id}/like`);
  return res.data;
}

export async function unlikeComment(id: string) {
  const res = await api.delete(`/comments/${id}/like`);
  return res.data;
}

export default api;
