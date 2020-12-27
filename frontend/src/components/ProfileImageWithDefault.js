import React from "react";
import DefaultPicture from "../assets/profile.png";
const ProfileImageWithDefault = ({ image, alt, width, height, tempimage }) => {
  let imageSource = DefaultPicture;
  if (image) {
    imageSource = "/images/profile/" + image;
  }
  if (tempimage) {
    imageSource = tempimage;
  }
  return (
    <img
      className="rounded-circle shadow"
      width={width}
      height={height}
      alt={alt}
      src={imageSource}
      onError={(event) => {
        event.target.src = DefaultPicture;
      }}
    />
  );
};

export default ProfileImageWithDefault;
