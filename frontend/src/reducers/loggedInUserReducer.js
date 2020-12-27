import {
  DISPLAYNAME_UPDATED_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from "../store/types";
import SecureLS from "secure-ls";
const sucureLs = new SecureLS();

const loggedInUser = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      const data = {
        ...payload,
        isLoggedIn: true,
      };
      sucureLs.set("hoax-user", data);
      return data;
    case DISPLAYNAME_UPDATED_SUCCESS:
      const dataUpdate = {
        ...state,
        displayName: payload.displayName,
        image: payload.image,
      };
      sucureLs.set("hoax-user", dataUpdate);
      return dataUpdate;
    case LOGOUT_SUCCESS:
      sucureLs.clear();
      return {
        isLoggedIn: false,
      };
    default:
      return {
        ...state,
      };
  }
};

export default loggedInUser;
