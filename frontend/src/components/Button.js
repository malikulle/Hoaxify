import React from "react";

const Button = (props) => {
  let { pendingApiCall, label, type, className, onClick } = props;
  if (!type) type = "button";
  if (!className) className = "btn btn-primary";
  return (
      <button
        onClick={onClick}
        className={className}
        disabled={pendingApiCall}
        type={type}
      >
        {pendingApiCall && (
          <div className="spinner-border spinner-border-sm"></div>
        )}
        {label}
      </button>
  );
};

export default Button;
