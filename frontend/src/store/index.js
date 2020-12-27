import { combineReducers } from "redux";
import loggeedInUserReducer from "../reducers/loggedInUserReducer";

const rootReducers = combineReducers({
  loggedInUser: loggeedInUserReducer,
});

export default rootReducers;
