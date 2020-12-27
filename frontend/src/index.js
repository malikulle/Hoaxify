import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./bootstrap-override/bootstrap-override.scss";
import "alertifyjs/build/css/alertify.min.css";
import "./App.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./i18n";
import store from "./store/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

reportWebVitals();
