import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import Input from "./Input";
import { deleteUser, logoutSuccess, updateUser } from "../api/apiCalls";
import alertify from "alertifyjs";
import Button from "./Button";
import Modal from "./Modal";
import { useApiProgress } from "./ApiProgress";
import { DISPLAYNAME_UPDATED_SUCCESS } from "../store/types";
import { useHistory } from "react-router-dom";
const ProfileCard = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory()

  const [user, setUser] = useState({});
  const [inEditMode, setInEditMode] = useState(false);
  const [updatedDisplayName, setUpdatedDisplayName] = useState("");
  const [errors, setErrors] = useState([]);
  const [newImage, setNewImage] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const pendingApiCall = useApiProgress(
    "put",
    `/api/1.0/users/${user.username}`
  );

  const { loggedInUser } = useSelector((store) => ({
    loggedInUser: store.loggedInUser,
  }));

  useEffect(() => {
    setUser({
      ...props.user,
    });
    setUpdatedDisplayName(props.user.displayName);
  }, [props.user]);

  let { username, image, displayName } = user;

  const handleClose = () => {
    setUpdatedDisplayName(loggedInUser.displayName);
    setNewImage(undefined);
    setInEditMode(false);
  };
  const onClickSave = async () => {
    try {
      const { data } = await updateUser(user.username, {
        displayName: updatedDisplayName,
        image: newImage === undefined ? null : newImage.split(",")[1],
      });
      alertify.success(t("success.update"));
      dispatch({
        type: DISPLAYNAME_UPDATED_SUCCESS,
        payload: {
          displayName: data.displayName,
          image: data.image,
        },
      });
      setInEditMode(false);
      setUser((previousState) => ({
        ...previousState,
        displayName: data.displayName,
      }));
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.validationErrors) {
          setErrors(data.validationErrors);
        }
      }
    }
  };
  const onChangeFile = (event) => {
    setErrors((previousState) => ({
      ...previousState,
      image: undefined,
    }));
    if (event.target.files.length < 1) return;
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setNewImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };
  const onClickCancel = () => {
    setModalVisible(false);
  };

  const onClickDeleteUser = async () => {
    await deleteUser(username);
    setModalVisible(false);
    dispatch(logoutSuccess());
    history.push('/');
  };
  const buttonText = (
    <>
      <span className="material-icons">save</span>
      {t("save")}
    </>
  );
  const pendingApiCallDeleteUser = useApiProgress(
    "delete",
    "/api/1.0/users/" + username
  );

  return (
    <div className="card  text-center">
      <div className="card-header">
        <ProfileImageWithDefault
          width="200"
          height="200"
          alt={user.username}
          image={image}
          tempimage={newImage}
        />
      </div>
      <div className="card-body">
        {!inEditMode && (
          <>
            <h3>
              {displayName}@{username}
            </h3>
            {username === loggedInUser.username && (
              <>
                <button
                  className="btn btn-success d-inline-flex"
                  onClick={() => setInEditMode(true)}
                >
                  <span className="material-icons">create</span>
                  {t("edit")}
                </button>
                <div className="pt-2">
                  <button
                    className="btn btn-danger d-inline-flex"
                    onClick={() => setModalVisible(true)}
                  >
                    <i className="material-icons">directions_run</i>
                    {t("Delete My Account")}
                  </button>
                </div>
              </>
            )}
          </>
        )}
        {inEditMode && (
          <div>
            <Input
              name="displayName"
              label={t("userSignup.displayName")}
              onChange={(e) => {
                setUpdatedDisplayName(e.target.value);
                setErrors((previousState) => ({
                  ...previousState,
                  displayName: undefined,
                }));
              }}
              value={displayName}
              error={errors.displayName}
            />
            <Input
              type="file"
              className="form-control-file"
              error={errors.image}
              onChange={onChangeFile}
            />
            <div>
              <Button
                className="btn btn-primary d-inline-flex"
                onClick={onClickSave}
                type="button"
                label={buttonText}
                pendingApiCall={pendingApiCall}
                disabled={pendingApiCall}
              />
              <button
                className="btn btn-light d-inline-flex ml-2"
                onClick={handleClose}
              >
                <span className="material-icons">close</span>
                {t("cancel")}
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal
        visible={modalVisible}
        title={t("Delete My Account")}
        okButton={t("Delete My Account")}
        onClickCancel={onClickCancel}
        onClickOk={onClickDeleteUser}
        message={t("Are you sure to delete your account?")}
        pendingApiCall={pendingApiCallDeleteUser}
      />
    </div>
  );
};

export default ProfileCard;
