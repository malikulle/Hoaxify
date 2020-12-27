import axios from "axios";
import { LOGOUT_SUCCESS } from "../store/types";

export const signup = (body) => {
  return axios.post("/api/1.0/users", body);
};

export const login = (credentials) => {
  return axios.post("/api/1.0/auth", credentials);
};

export const getUsers = (page = 0, size = 3) => {
  return axios.get(`/api/1.0/users?page=${page}&size=${size}`);
};

export const getUser = (username) => {
  return axios.get(`/api/1.0/users/${username}`);
};

export const updateUser = (username, body) => {
  return axios.put(`/api/1.0/users/${username}`, body);
};

export const postHoax = (hoax) => {
  return axios.post("/api/1.0/hoaxes", hoax);
};

export const getHoaxes = (username, page = 0) => {
  if (username) {
    return axios.get(`/api/1.0/hoaxes/${username}/users?page=${page}`);
  }
  return axios.get(`/api/1.0/hoaxes?page=${page}`);
};

export const getOldHoaxes = (username, id) => {
  if (username) {
    return axios.get(`/api/1.0/hoaxes/${username}/users/${id}`);
  }
  return axios.get(`/api/1.0/hoaxes/${id}`);
};

export const getNewHoaxCount = (username, id) => {
  if (username) {
    return axios.get(`/api/1.0/hoaxes/${username}/users/${id}?count=true`);
  }
  return axios.get(`/api/1.0/hoaxes/${id}?count=true`);
};

export const getNewHoaxes = (username, id) => {
  if (username) {
    return axios.get(`/api/1.0/hoaxes/${username}/users/${id}?direction=after`);
  }
  return axios.get(`/api/1.0/hoaxes/${id}?direction=after`);
};

export const postHoaxAttachment = (body) => {
  return axios.post("/api/1.0/hoax-attachment", body);
};

export const deleteHox = (id) => {
  return axios.delete(`/api/1.0/hoaxes/${id}`);
};
export const deleteUser = (username) => {
  return axios.delete(`/api/1.0/users/${username}`);
};

export const logoutSuccess = () => {
  return { type: LOGOUT_SUCCESS };
};

export const logout = () => {
  return axios.post("/api/1.0/auth/logout")
}




