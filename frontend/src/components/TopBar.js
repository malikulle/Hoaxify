import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { logout } from "../api/apiCalls";
import logo from "../assets/hoaxify.png";
import { LOGOUT_SUCCESS } from "../store/types";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
const TopBar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const { loggedInUser } = useSelector((store) => ({
    loggedInUser: store.loggedInUser,
  }));

  const { isLoggedIn, username, displayName, image } = loggedInUser;

  useEffect(() => {
    document.addEventListener("click", menuClickTracker);
    return () => {
      document.removeEventListener("click", menuClickTracker);
    };
  }, [isLoggedIn]);

  const [menuVisible, setMenuVisible] = useState(false);
  const menuArea = useRef(null);

  const menuClickTracker = (event) => {
    if (menuArea.current === null || !menuArea.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };
  const handleLogoutClick = async () => {
    try {
      
      await logout();
    } catch (error) {
      
    }
    dispatch({ type: LOGOUT_SUCCESS });
    history.push("/");
  };

  let links = (
    <ul className="navbar-nav ml-auto">
      <li>
        <Link className="nav-link" to="/login">
          {t("userLoginPage.Login")}
        </Link>
      </li>
      <li>
        <Link className="nav-link" to="/signup">
          {t("userSignup.signUp")}
        </Link>
      </li>
    </ul>
  );
  if (isLoggedIn) {
    let dropdownClass = "dropdown-menu p-0 shadow";
    if (menuVisible) dropdownClass = "dropdown-menu p-0 show shadow";
    links = (
      <ul className="navbar-nav ml-auto" ref={menuArea}>
        <li className="nav-item dropdown">
          <div
            className="d-flex"
            style={{ cursor: "pointer" }}
            onClick={() => setMenuVisible(true)}
          >
            <ProfileImageWithDefault
              image={image}
              width="32"
              height="32"
              alt="profile"
              className="rounded-circle m-auto"
            />
            <span className="nav-link dropdown-toggle">{displayName}</span>
          </div>
          <div className={dropdownClass}>
            <Link
              className="dropdown-item d-flex p-2"
              to={"/user/" + username}
              onClick={() => setMenuVisible(false)}
            >
              <i className="material-icons text-info mr-2">person</i>
              {t("myProfile")}
            </Link>
            <span
              className="dropdown-item d-flex p-2"
              style={{ cursor: "pointer" }}
              onClick={() => handleLogoutClick()}
            >
              <i className="material-icons text-danger mr-2">
                power_settings_new
              </i>
              {t("logout")}
            </span>
          </div>
        </li>
      </ul>
    );
  }
  return (
    <div className="shadow-sm bg-light">
      <nav className="navbar navbar-light navbar-expand container">
        <Link className="navbar-brand" to="/">
          <img src={logo} width="60" alt="" />
          Hoaxify
        </Link>
        {links}
      </nav>
    </div>
  );
};

export default TopBar;
