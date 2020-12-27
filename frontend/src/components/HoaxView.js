import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { format } from "timeago.js";
import { useTranslation } from "react-i18next";
import { deleteHox } from "../api/apiCalls";
import { useApiProgress } from "./ApiProgress";
import Modal from "./Modal";

const HoaxView = (props) => {
  const { loggedInUser } = useSelector((store) => ({
    loggedInUser: store.loggedInUser,
  }));

  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);

  const { hoax, onDeleteHoax } = props;
  const { user, content, timestamp, fileAttachment, id } = hoax;
  const { username, displayName, image } = user;
  const { i18n } = useTranslation();

  const formatted = format(timestamp, i18n.language);

  const ownedLoggedInUser = loggedInUser.username === username;
  const pendingApiCall = useApiProgress("delete", `/api/1.0/hoaxes/${id}`);

  const onClickDelete = async () => {
    await deleteHox(id);
    onDeleteHoax(id);
  };
  const onClickCancel = () => {
    setModalVisible(false);
  };
  return (
    <div className="card p-1">
      <div className="d-flex">
        <div className="m-1">
          <ProfileImageWithDefault image={image} height={32} width={32} />
        </div>
        <div className="flex-fill m-auto pl-2">
          <Link to={`user/${username}`} className="text-dark">
            <h6 className="d-inline">
              {displayName}@{username}
            </h6>
            <span> - </span>
            <span>{formatted}</span>
          </Link>
        </div>
        {ownedLoggedInUser && (
          <button
            className="btn btn-delete-link"
            onClick={() => setModalVisible(true)}
          >
            <span className="material-icons">delete_outline</span>
          </button>
        )}
      </div>
      <div className="pl-5">{content}</div>
      {fileAttachment && (
        <div className="pl-5">
          <img
            className="img-fluid"
            src={"images/attachment/" + fileAttachment.name}
            alt=""
          />
        </div>
      )}
      <Modal
        visible={modalVisible}
        title={t("Delete Hoax")}
        onClickCancel={onClickCancel}
        onClickOk={onClickDelete}
        message={
          <div>
            <div>
              <strong>{t("Are you sure to delete hoax?")}</strong>
            </div>
          </div>
        }
        pendingApiCall={pendingApiCall}
        okButton={t("Delete Hoax")}
      />
    </div>
  );
};

export default HoaxView;
