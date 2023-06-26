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
import {
  getBoardOrientation,
  getPlayerDOMElement,
  injectReactRootIntoDOM,
} from "../utils/dom";

// TODO: Funktion refactoren, dass jeweils alle Schritte nur für eine Farbe durchgegangen werden, dann die Funktion für jede Farbe ausführen lassen
async function createWLDStats() {
  const currentGame = await getCurrentGameById();
  console.log({ currentGame });

  if (!currentGame) {
    return null;
  }

  const playerBlackDOM = getPlayerDOMElement(currentGame.players.black);
  const playerWhiteDOM = getPlayerDOMElement(currentGame.players.white);

  const blackRoot = injectReactRootIntoDOM(
    playerBlackDOM,
    "crx-wld-root-black"
  );
  const whiteRoot = injectReactRootIntoDOM(
    playerWhiteDOM,
    "crx-wld-root-white"
  );

  // TODO: Hiermit arbeiten, hook bauen die abfragt ob die Orientation geändert wurde und dann erneut die WLD Stats rendert, im besten Fall ohne erneuten API Call
  const boardOrientation = getBoardOrientation();

  const pastGamesBlack = await getGames(
    currentGame.players.black,
    getPastTimestamp(72),
    true,
    "rapid"
  );

  const pastGamesWhite = await getGames(
    currentGame.players.white,
    getPastTimestamp(72),
    true,
    "rapid"
  );

  if (pastGamesBlack) {
    const blackWLDStats = calculateWLDStats(
      pastGamesBlack,
      currentGame.players.black
    );

    ReactDOM.createRoot(blackRoot).render(
      <React.StrictMode>
        <Stats
          wins={blackWLDStats.wins}
          losses={blackWLDStats.losses}
          draws={blackWLDStats.draws}
        />
      </React.StrictMode>
    );
  }

  if (pastGamesWhite) {
    const whiteWLDStats = calculateWLDStats(
      pastGamesWhite,
      currentGame.players.white
    );

    ReactDOM.createRoot(whiteRoot).render(
      <React.StrictMode>
        <Stats
          wins={whiteWLDStats.wins}
          losses={whiteWLDStats.losses}
          draws={whiteWLDStats.draws}
        />
      </React.StrictMode>
    );
  }
}

await createWLDStats();
