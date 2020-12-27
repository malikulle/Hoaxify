import SecureLS from "secure-ls";
const sucureLs = new SecureLS();
const loggedInUser = sucureLs.get("hoax-user");

let initialState = {
  loggedInUser: {
    username: null,
    displayName: null,
    password: null,
    isLoggedIn: false,
  },
};

if (loggedInUser) {
  initialState.loggedInUser = {
    ...loggedInUser,
  };
}

export default initialState;
