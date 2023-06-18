import React from "react";
import ReactDOM from "react-dom/client";
import "../styles/global.css";
import Hello from "../components/Hello/Hello";

const root = document.createElement("div");
root.id = "crx-wld-root";
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Hello />
  </React.StrictMode>
);
