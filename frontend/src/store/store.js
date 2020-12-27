import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import initialState from "./initialState";
import rootReducers from "./index";
import {  setAuthorizationHeader } from "../config/api";

const middleware = [thunk];

//setBaseURL();

const store = createStore(
  rootReducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
const getStateFromStraoge = () => {
  const state = store.getState();
  setAuthorizationHeader(state.loggedInUser);
};
getStateFromStraoge();

store.subscribe(() => {
  getStateFromStraoge();
});

export default store;
