/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import ReactDOM from "react-dom/client";
import "../styles/global.css";
import Hello from "../components/Hello/Hello";

//TODO: Popup konfiguriert Abfragen an die API - über localstorage hook.

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Hello />
  </React.StrictMode>
);
