import React from "react";
import { Link } from "react-router-dom";
import ProfileImageWithDefault from "./ProfileImageWithDefault";

const UserListItem = ({ user }) => {
  return (
    <Link
      to={`/user/${user.username}`}
      className="list-group-item list-group-item-action"
    >
      <ProfileImageWithDefault
        width="32"
        height="32"
        alt={user.username}
        src={user.image}
        image={user.image}
      />
      <span className="pl-2">
        {user.username} @ {user.displayName}
      </span>
    </Link>
  );
};

export default UserListItem;
