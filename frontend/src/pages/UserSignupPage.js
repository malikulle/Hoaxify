import React, { useState } from "react";
import Button from "../components/Button";
import { signup } from "../api/apiCalls";
import Input from "../components/Input";
import alertify from "alertifyjs";
import { useApiProgress } from "../components/ApiProgress";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { LOGIN_SUCCESS } from "../store/types";
import { useHistory } from "react-router-dom";
const UserSignupPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    password: "",
    rePassword: "",
  });
  const [errors, setErrors] = useState([]);

  const pendingApiCallSignup = useApiProgress("post", "/api/1.0/users");

  const pendingApiCall = pendingApiCallSignup;
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
    setErrors((previousState) => ({ ...previousState, [name]: undefined }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.rePassword) {
      alertify.error(t("userSignup.passwordNotMatch"));
      return;
    }
    try {
      await signup(form);
      dispatch({ type: LOGIN_SUCCESS, payload: { ...form } });
      history.push("/");
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.validationErrors) {
          setErrors(data.validationErrors);
        }
      }
    }
  };

  if (form.password !== form.rePassword) {
    errors.rePassword = t("userSignup.passwordNotMatch");
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3"></div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header text-center">
              <div>{t("userSignup.signUp")}</div>
            </div>
            <div className="card-body">
              <form>
                <Input
                  type="text"
                  name="username"
                  label={t("userSignup.username")}
                  onChange={handleOnChange}
                  error={errors.username}
                />
                <Input
                  type="text"
                  name="displayName"
                  label={t("userSignup.displayName")}
                  onChange={handleOnChange}
                  error={errors.displayName}
                />
                <Input
                  type="password"
                  name="password"
                  label={t("userSignup.password")}
                  onChange={handleOnChange}
                  error={errors.password}
                />
                <Input
                  type="password"
                  name="rePassword"
                  label={t("userSignup.rePassword")}
                  onChange={handleOnChange}
                  error={errors.rePassword}
                />
                <div className="text-center mt-2">
                  <Button
                    className="btn btn-primary"
                    disabled={pendingApiCall}
                    type="button"
                    onClick={onSubmit}
                    label={t("userSignup.signUp")}
                    pendingApiCall={pendingApiCall}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-3"></div>
      </div>
    </div>
  );
};

export default UserSignupPage;
