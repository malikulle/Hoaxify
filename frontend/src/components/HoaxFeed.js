import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getHoaxes,
  getNewHoaxCount,
  getNewHoaxes,
  getOldHoaxes,
} from "../api/apiCalls";
import HoaxView from "./HoaxView";
import { useApiProgress } from "./ApiProgress";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";

const HoaxFeed = () => {
  const pendingApiCall = useApiProgress("get", "/api/1.0/hoaxes");
  const { t } = useTranslation();
  const { username } = useParams();

  const [newHoaxCount, setNewHoaxCount] = useState(0);

  const [hoaxPage, setHoaxPage] = useState({
    content: [],
    last: true,
    number: 0,
  });

  let firstHoaxId = 0;

  if (hoaxPage.content.length > 0) {
    firstHoaxId = hoaxPage.content[0].id;
  }

  const loadOldHoaxes = async () => {
    const lastHoaxIndex = hoaxPage.content.length - 1;
    const lastHoaxId = hoaxPage.content[lastHoaxIndex].id;

    try {
      const { data } = await getOldHoaxes(username, lastHoaxId);
      setHoaxPage((previousState) => ({
        ...data,
        content: [...previousState.content, ...data.content],
      }));
    } catch (error) {}
  };

  const loadNewHoaxesProgress = useApiProgress(
    "get",
    `/api/1.0/hoaxes/${firstHoaxId}?direction=after`
  );

  const loadNewHoaxes = async () => {
    try {
      const { data } = await getNewHoaxes(username, firstHoaxId);
      setHoaxPage((previousState) => ({
        ...data,
        content: [...data, ...previousState.content],
      }));
      setNewHoaxCount(0);
    } catch (error) {}
  };

  const onDeleteSuccess = (id) => {
    setHoaxPage((previousState) => ({
      ...previousState,
      content: previousState.content.filter((x) => x.id !== id),
    }));
  };

  useEffect(() => {
    const getCount = async () => {
      try {
        const { data } = await getNewHoaxCount(username, firstHoaxId);
        setNewHoaxCount(data.count);
      } catch (error) {
        setNewHoaxCount(0);
      }
    };
    let looper = setInterval(() => {
      getCount();
    }, 3500);
    return function cleanUp() {
      clearInterval(looper);
    };
  }, [firstHoaxId, username]);

  useEffect(() => {
    const loadHoaxes = async (page) => {
      const { data } = await getHoaxes(username, page);
      setHoaxPage((previousState) => ({
        ...data,
        content: [...previousState.content, ...data.content],
      }));
    };
    loadHoaxes();
  }, [username]);

  const { content, last } = hoaxPage;

  if (content.length === 0) {
    return (
      <div className="alert alert-secondary text-center">{t("noHoax")}</div>
    );
  }
  return (
    <div>
      {newHoaxCount > 0 && (
        <div
          onClick={() => (loadNewHoaxesProgress ? () => {} : loadNewHoaxes())}
          style={{ cursor: loadNewHoaxesProgress ? "not-allowed" : "pointer" }}
          className="alert alert-secondary text-center"
        >
          {loadNewHoaxesProgress ? (
            <Spinner />
          ) : (
            <span>{t("loadNewHoaxes")}</span>
          )}
        </div>
      )}

      {content.map((hoax) => (
        <HoaxView key={hoax.id} hoax={hoax} onDeleteHoax={onDeleteSuccess} />
      ))}
      {!last && (
        <>
          {pendingApiCall && (
            <div
              style={{ cursor: "pointer" }}
              className="alert alert-secondary text-center"
            >
              <Spinner />
            </div>
          )}
          {!pendingApiCall && (
            <div
              onClick={() => loadOldHoaxes()}
              style={{ cursor: "pointer" }}
              className="alert alert-secondary text-center"
            >
              {t("loadOldHoax")}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HoaxFeed;
