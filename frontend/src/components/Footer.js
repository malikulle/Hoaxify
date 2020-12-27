import React from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const LanguageSelector = (props) => {
  const { i18n } = useTranslation();
  const onChangeLanguage = (language) => {
    axios.defaults.headers["accept-language"] = language;
    i18n.changeLanguage(language);
  };
  return (
    <div className="container">
      <img
        src="https://www.countryflags.io/tr/flat/24.png"
        style={{ cursor: "pointer" }}
        alt=""
        onClick={() => onChangeLanguage("tr")}
      />
      <img
        src="https://www.countryflags.io/us/flat/24.png"
        style={{ cursor: "pointer" }}
        alt=""
        onClick={() => onChangeLanguage("en")}
      />
    </div>
  );
};

export default LanguageSelector;