import React from "react";
import ReactDOM from "react-dom/client";
import "../styles/global.css";
import Stats from "../components/Stats/Stats";
import {
  calculateWLDStats,
  getCurrentGameById,
  getGames,
  getPastTimestamp,
} from "../utils/lichessApi";

// Create root element for React element to be inserted into the DOM
const bottomRoot = document.createElement("div");
bottomRoot.id = "crx-wld-root-bottom";
const topRoot = document.createElement("div");
topRoot.id = "crx-wld-root-top";

const userBottomElement = document.querySelector(".ruser-bottom");
const userTopElement = document.querySelector(".ruser-top");
userBottomElement?.insertBefore(bottomRoot, userBottomElement.childNodes[2]);
userTopElement?.insertBefore(topRoot, userTopElement.childNodes[2]);

const currentGame = await getCurrentGameById();
console.log({ currentGame });

// TODO: ANhand von currentGame für beide Spieler WLD holen und an die richtige Stelle im DOM setzen

const games = await getGames(
  "SchachMannVomBrett",
  getPastTimestamp(72),
  true,
  "rapid"
);

const bottomStats = calculateWLDStats(games, "SchachMannVomBrett");

ReactDOM.createRoot(bottomRoot).render(
  <React.StrictMode>
    <Stats
      wins={bottomStats.wins}
      losses={bottomStats.losses}
      draws={bottomStats.draws}
    />
  </React.StrictMode>
);

ReactDOM.createRoot(topRoot).render(
  <React.StrictMode>
    <Stats wins={6} losses={6} draws={6} />
  </React.StrictMode>
);
