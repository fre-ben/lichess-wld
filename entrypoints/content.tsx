import React from "react";
import ReactDOM from "react-dom/client";
import {
  calculateWLDStats,
  getCurrentGameById,
  getGames,
  getPastTimestamp,
} from "./utils/api";
import Stats from "./components/Stats";
import type { CurrentGame, WLDStats } from "./types/lichess";

export default defineContentScript({
  matches: ["https://lichess.org/*"],
  cssInjectionMode: "manifest",
  async main() {
    const currentGame = await getCurrentGameById();

    if (!currentGame) {
      return;
    }

    const [whiteStats, blackStats] = await Promise.all([
      fetchStats(currentGame.players.white, currentGame),
      fetchStats(currentGame.players.black, currentGame),
    ]);

    const statsDivs = new Map<string, HTMLElement>();

    for (const [userName, stats] of [
      [currentGame.players.white, whiteStats],
      [currentGame.players.black, blackStats],
    ] as [string, WLDStats][]) {
      if (userName === "AI" || !stats) continue;
      const div = createStatsDiv(userName, stats);
      statsDivs.set(userName.toLowerCase(), div);
    }

    placeStatsDivs(statsDivs);
    watchForFlip(statsDivs);
  },
});

async function fetchStats(
  userName: string,
  currentGame: CurrentGame,
): Promise<WLDStats | null> {
  if (userName === "AI") return null;

  const pastGames = await getGames(
    userName,
    getPastTimestamp(12),
    true,
    currentGame.perfType,
  );

  return calculateWLDStats(pastGames, userName);
}

function createStatsDiv(userName: string, stats: WLDStats): HTMLElement {
  const div = document.createElement("div");
  div.id = `crx-wld-root-${userName.toLowerCase()}`;

  ReactDOM.createRoot(div).render(
    <React.StrictMode>
      <Stats
        wins={stats.wins}
        losses={stats.losses}
        draws={stats.draws}
        winRate={stats.winRate}
      />
    </React.StrictMode>,
  );

  return div;
}

function placeStatsDivs(statsDivs: Map<string, HTMLElement>) {
  for (const container of [".ruser-top", ".ruser-bottom"]) {
    const ruser = document.querySelector(container);
    if (!ruser) continue;

    const anchor = ruser.querySelector("a.user-link");
    if (!anchor) continue;

    const userName = anchor.getAttribute("href")?.replace("/@/", "")?.toLowerCase();
    if (!userName) continue;

    const div = statsDivs.get(userName);
    if (!div) continue;

    anchor.insertAdjacentElement("afterend", div);
  }
}

function watchForFlip(statsDivs: Map<string, HTMLElement>) {
  const parent = document.querySelector(".round__app");
  if (!parent) return;

  let topUser = document.querySelector(".ruser-top a.user-link")?.getAttribute("href");
  let bottomUser = document.querySelector(".ruser-bottom a.user-link")?.getAttribute("href");

  const observer = new MutationObserver(() => {
    const newTopUser = document.querySelector(".ruser-top a.user-link")?.getAttribute("href");
    const newBottomUser = document.querySelector(".ruser-bottom a.user-link")?.getAttribute("href");

    if (newTopUser !== topUser || newBottomUser !== bottomUser) {
      topUser = newTopUser;
      bottomUser = newBottomUser;
      observer.disconnect();
      placeStatsDivs(statsDivs);
      observer.observe(parent, { childList: true, subtree: true });
    }
  });

  observer.observe(parent, { childList: true, subtree: true });
}
