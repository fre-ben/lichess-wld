/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import ReactDOM from "react-dom/client";
import "../styles/global.css";
import Hello from "../components/hello/Hello";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Hello />
  </React.StrictMode>
);
