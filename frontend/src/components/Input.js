import React from "react";

const Input = (props) => {
  let { onChange, type, name, label, error, disabled, value } = props;
  if (!type) type = "text";
  let className = "form-control";
  if (type === "file") {
    className += "file";
  }
  if (error) {
    className += " is-invalid";
  }
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input
        type={type}
        name={name}
        disabled={disabled}
        onChange={onChange}
        className={className}
        defaultValue={value}
      />
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default Input;
