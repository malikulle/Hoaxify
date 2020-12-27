import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { postHoax, postHoaxAttachment } from "../api/apiCalls";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { useApiProgress } from "./ApiProgress";
import Button from "./Button";
import Input from "./Input";
import AutoUploadImage from "./AutoUploadImage";

const HoaxSubmit = () => {
  const pendingApiCall = useApiProgress("post", "/api/1.0/hoaxes");
  const pendingFileUpload = useApiProgress(
    "post",
    "/api/1.0/hoax-attachment",
    true
  );
  const { t } = useTranslation();
  const { loggedInUser } = useSelector((store) => ({
    loggedInUser: store.loggedInUser,
  }));

  const [focused, setFocused] = useState(false);
  const [hoax, setHoax] = useState("");
  const [errors, setErrors] = useState({});
  const [newImage, setNewImage] = useState("");
  const [attachmentId, setAttachementId] = useState(null);

  useEffect(() => {
    if (!focused) {
      setHoax("");
      setNewImage("");
      setErrors({});
      setAttachementId(null)
    }
  }, [focused]);

  useEffect(() => {
    setErrors({});
  }, [hoax]);
  const { image } = loggedInUser;

  const onSubmit = async () => {
    try {
      const body = {
        content: hoax,
        attachmentId: attachmentId,
      };
      await postHoax(body);
      setFocused(false);
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
    if (event.target.files.length < 1) return;
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setNewImage(fileReader.result);
      uploadFile(file);
    };
    fileReader.readAsDataURL(file);
  };

  const uploadFile = async (file) => {
    const attachment = new FormData();
    attachment.append("file", file);
    try {
      const { data } = await postHoaxAttachment(attachment);
      setAttachementId(data.id);
    } catch (error) {}
  };

  let textAreaClass = "form-control";
  if (errors.content) {
    textAreaClass += " is-invalid";
  }

  return (
    <div className="card p-2 flex-row">
      <div className="mr-1">
        <ProfileImageWithDefault image={image} width="32" height="32" />
      </div>
      <div className="flex-fill">
        <textarea
          value={hoax}
          onChange={(e) => setHoax(e.target.value)}
          className={textAreaClass}
          rows={focused ? "3" : "1"}
          onFocus={() => setFocused(true)}
        />
        {errors.content && <div className="text-danger">{errors.content}</div>}
        {focused && (
          <>
            <Input type="file" onChange={onChangeFile} />
            {newImage && (
              <AutoUploadImage uploading={pendingFileUpload} image={newImage} />
            )}
            <div className="text-right mt-2">
              <Button
                className="btn btn-primary btn-sm"
                pendingApiCall={pendingApiCall}
                disabled={pendingApiCall || pendingFileUpload}
                onClick={onSubmit}
                label="Hoax"
              />

              <button
                className="btn btn-light btn-sm d-inline-flex ml-2"
                onClick={() => setFocused(false)}
              >
                <span className="material-icons">close</span>
                {t("cancel")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HoaxSubmit;
