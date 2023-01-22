import React from "react";
import { useLocation } from "react-router-dom";

const PageTitle = () => {
  const location = useLocation();
  let title = location.pathname.replaceAll("/", "").replaceAll("-", " ");

  return (
    <>
      {title && (
        <div className="page-title">
          <div className="container">
            <h1>{title}</h1>
          </div>
        </div>
      )}
    </>
  );
};

export default PageTitle;
