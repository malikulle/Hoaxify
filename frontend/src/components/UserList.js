import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUsers } from "../api/apiCalls";
import UserListItem from "./UserListItem";
import { useApiProgress } from "./ApiProgress";
import Spinner from "./Spinner";

const UserList = (props) => {
  const { t } = useTranslation();
  const pendingApiCall = useApiProgress("get", "/api/1.0/users");
  const [page, setPage] = useState({
    content: [],
    number: 0,
    size: 3,
  });
  const [loadFailure, setLoadFailure] = useState(false);
  const getAllUsers = async (page, size) => {
    try {
      const { data } = await getUsers(page, size);
      setPage(data);
    } catch (error) {
      setLoadFailure(true)
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  const loadPage = async (type) => {
    let pageNumber = page.number;
    if (type === "next") pageNumber = pageNumber + 1;
    if (type === "prev") pageNumber = pageNumber - 1;
    await getAllUsers(pageNumber);
  };
  const { last, first, content } = page;
  let actionDiv = (
    <div>
      {first === false && (
        <button
          className="btn btn-light btn-sm"
          onClick={() => loadPage("prev")}
        >
          {t("previous")}
        </button>
      )}
      {last === false && (
        <button
          className="btn btn-light btn-sm float-right"
          onClick={() => loadPage("next")}
        >
          {t("next")}
        </button>
      )}
    </div>
  );
  if (pendingApiCall) {
    actionDiv = <Spinner />;
  }
  return (
    <div className="card">
      <div className="card-header text-center">
        <h3>{t("users")}</h3>
      </div>
      <div className="list-group-flush">
        {content.map((user) => (
          <UserListItem user={user} key={user.username} />
        ))}
      </div>
      {actionDiv}
      {loadFailure && (
        <div className="text-center text-danger">{t("LoadFailure")}</div>
      )}
    </div>
  );
};

export default UserList;
