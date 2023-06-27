import React from "react";
import ReactDOM from "react-dom/client";
import "../styles/global.css";
import Stats from "../components/Stats/Stats";
import {
  calculateWLDStats,
  getCurrentGameById,
  getGames,
  getPastTimestamp,
} from "../utils/api";
import {
  getBoardOrientation,
  getPlayerDOMElement,
  injectReactRootIntoDOM,
} from "../utils/dom";
import { CurrentGame } from "../types/lichess";

async function WLD() {
  const currentGame = await getCurrentGameById();
  console.log({ currentGame });

  if (!currentGame) {
    return null;
  }

  // TODO: Hiermit arbeiten, hook bauen die abfragt ob die Orientation geändert wurde und dann erneut die WLD Stats rendert, im besten Fall ohne erneuten API Call
  const boardOrientation = getBoardOrientation();

  await Promise.all([
    renderWLDStats("white", currentGame),
    renderWLDStats("black", currentGame),
  ]);
}

async function renderWLDStats(
  color: "black" | "white",
  currentGame: CurrentGame
) {
  const playerDOM = getPlayerDOMElement(currentGame.players[color]);

  const playerRoot = injectReactRootIntoDOM(
    playerDOM,
    color === "black" ? "crx-wld-root-black" : "crx-wld-root-white"
  );

  const pastGames = await getGames(
    currentGame.players[color],
    getPastTimestamp(12),
    true,
    currentGame.perfType
  );

  const WLDStats = calculateWLDStats(pastGames, currentGame.players[color]);

  ReactDOM.createRoot(playerRoot).render(
    <React.StrictMode>
      <Stats
        wins={WLDStats.wins}
        losses={WLDStats.losses}
        draws={WLDStats.draws}
      />
    </React.StrictMode>
  );
}

await WLD();
