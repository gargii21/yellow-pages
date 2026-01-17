import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/tasks",
});

export const getTasksByDate = async (date) => {
  const res = await API.get(`?date=${date}`);
  return res.data;
};

export const createTask = async (task) => {
  const res = await API.post("/", task);
  return res.data;
};

export const updateTask = async (id, data) => {
  const res = await API.patch(`/${id}`, data);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};
