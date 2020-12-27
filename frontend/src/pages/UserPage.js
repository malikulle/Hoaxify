import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useState } from "react/cjs/react.development";
import { getUser } from "../api/apiCalls";
import ProfileCard from "../components/ProfileCard";
import Spinner from "../components/Spinner";
import { useApiProgress } from "../components/ApiProgress";
import HoaxFeed from "../components/HoaxFeed";

const UserPage = (props) => {
  const [user, setUser] = useState({});
  const [error, setError] = useState(false);
  const { username } = useParams();
  const { t } = useTranslation();
  const pendingApiCall = useApiProgress("get", `/api/1.0/users/${username}`);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await getUser(username);
        setUser(data);
      } catch (error) {
        setError(true);
      }
    };
    loadUser();
  }, [username]);

  useEffect(() => {
    setError(false);
  }, [user]);

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <div>
          <span class="material-icons" style={{ fontSize: "48px" }}>
            error
          </span>
        </div>
        {t("userNotFound")}
      </div>
    );
  }
  if (pendingApiCall || user.username !== username) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <ProfileCard user={user} />
        </div>
        <div>
          <HoaxFeed />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
