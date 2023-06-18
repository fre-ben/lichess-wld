import React from "react";
import ReactDOM from "react-dom/client";
import "../styles/global.css";
import Stats from "../components/Stats/Stats";
import { getGames, getPastTimestamp } from "../utils/lichessApi";

// Create root element for React element to be inserted into the DOM
const bottomRoot = document.createElement("div");
bottomRoot.id = "crx-wld-root-bottom";
const topRoot = document.createElement("div");
topRoot.id = "crx-wld-root-top";

const userBottomElement = document.querySelector(".ruser-bottom");
const userTopElement = document.querySelector(".ruser-top");
userBottomElement?.insertBefore(bottomRoot, userBottomElement.childNodes[2]);
userTopElement?.insertBefore(topRoot, userTopElement.childNodes[2]);

const games = await getGames("SchachMannVomBrett", getPastTimestamp(72));

console.log("games", games);

ReactDOM.createRoot(bottomRoot).render(
  <React.StrictMode>
    <Stats wins={0} losses={1} draws={2} />
  </React.StrictMode>
);

ReactDOM.createRoot(topRoot).render(
  <React.StrictMode>
    <Stats wins={2} losses={0} draws={6} />
  </React.StrictMode>
);
