import url from "./url";
import axios from "axios";

export const setBaseURL = () => (axios.defaults.baseURL = url.BaseUrl);

export const setAuthorizationHeader = ({ isLoggedIn, token }) => {
  if (isLoggedIn) {
    const value = `Bearer ${token}`;
    axios.defaults.headers["Authorization"] = value;
  } else {
    delete axios.defaults.headers["Authorization"];
  }
};
