import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useApiProgress } from "../components/ApiProgress";
import { useTranslation } from "react-i18next";
import { login } from "../api/apiCalls";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LOGIN_SUCCESS } from "../store/types";
const UserLoginPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const pendingApiCall = useApiProgress("post", "/api/1.0/auth");

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login(form);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { ...data.user, token: data.token, password: form.password },
      });
      history.push("/");
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.message) {
          setError(data.message);
          setTimeout(() => {
            setError(null);
          }, 3000);
        }
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3"></div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header text-center">
              <div>{t("userLoginPage.Login")}</div>
            </div>
            <div className="card-body">
              <form>
                <Input
                  type="text"
                  name="username"
                  label={t("userSignup.username")}
                  onChange={handleOnChange}
                />
                <Input
                  type="password"
                  name="password"
                  label={t("userSignup.password")}
                  onChange={handleOnChange}
                />
                {error && (
                  <div className="mt-2">
                    <div className="alert alert-danger">{error}</div>
                  </div>
                )}
                <div className="text-center mt-2">
                  <Button
                    className="btn btn-primary"
                    disabled={pendingApiCall}
                    type="button"
                    onClick={onSubmit}
                    label={t("userLoginPage.Login")}
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

export default UserLoginPage;
