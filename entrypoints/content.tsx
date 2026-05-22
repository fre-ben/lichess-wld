import React from "react";
import ReactDOM from "react-dom/client";
import {
  calculateWLDStats,
  getCurrentGameById,
  getGames,
  getPastTimestamp,
} from "./utils/api";
import { getSettings } from "./utils/settings";
import Stats from "./components/Stats";
import type { CurrentGame, WLDStats } from "./types/lichess";
import type { Settings } from "./types/settings";

export default defineContentScript({
  matches: ["https://lichess.org/*"],
  cssInjectionMode: "manifest",
  async main() {
    const [currentGame, settings] = await Promise.all([
      getCurrentGameById(),
      getSettings(),
    ]);

    if (!currentGame) {
      return;
    }

    const [whiteStats, blackStats] = await Promise.all([
      fetchStats(currentGame.players.white, currentGame, settings.timespan),
      fetchStats(currentGame.players.black, currentGame, settings.timespan),
    ]);

    const roots = new Map<string, ReactDOM.Root>();
    const statsCache = new Map<string, WLDStats>();
    const statsDivs = new Map<string, HTMLElement>();

    for (const [userName, stats] of [
      [currentGame.players.white, whiteStats],
      [currentGame.players.black, blackStats],
    ] as [string, WLDStats | null][]) {
      if (userName === "AI" || !stats) continue;

      const key = userName.toLowerCase();
      const div = document.createElement("div");
      div.id = `crx-wld-root-${key}`;

      const root = ReactDOM.createRoot(div);
      renderStats(root, stats, settings);

      roots.set(key, root);
      statsCache.set(key, stats);
      statsDivs.set(key, div);
    }

    placeStatsDivs(statsDivs);
    watchForFlip(statsDivs);

    let activeSettings = settings;

    storage.watch<boolean>("sync:showWinRate", (newValue) => {
      activeSettings = { ...activeSettings, showWinRate: newValue ?? true };
      for (const [key, root] of roots) {
        const cached = statsCache.get(key);
        if (cached) renderStats(root, cached, activeSettings);
      }
    });

    storage.watch<6 | 12 | 24>("sync:timespan", async (newValue) => {
      const newTimespan = newValue ?? 12;
      activeSettings = { ...activeSettings, timespan: newTimespan };

      for (const [key, root] of roots) {
        const cached = statsCache.get(key);
        if (cached) renderStats(root, cached, activeSettings, true);
      }

      const [newWhiteStats, newBlackStats] = await Promise.all([
        fetchStats(currentGame.players.white, currentGame, newTimespan),
        fetchStats(currentGame.players.black, currentGame, newTimespan),
      ]);

      for (const [userName, newStats] of [
        [currentGame.players.white, newWhiteStats],
        [currentGame.players.black, newBlackStats],
      ] as [string, WLDStats | null][]) {
        if (userName === "AI" || !newStats) continue;
        const key = userName.toLowerCase();
        const root = roots.get(key);
        if (!root) continue;
        statsCache.set(key, newStats);
        renderStats(root, newStats, activeSettings);
      }
    });
  },
});

function renderStats(
  root: ReactDOM.Root,
  stats: WLDStats,
  settings: Settings,
  loading = false,
) {
  root.render(
    <React.StrictMode>
      <Stats
        wins={stats.wins}
        losses={stats.losses}
        draws={stats.draws}
        winRate={stats.winRate}
        showWinRate={settings.showWinRate}
        loading={loading}
      />
    </React.StrictMode>,
  );
}

async function fetchStats(
  userName: string,
  currentGame: CurrentGame,
  timespan: number,
): Promise<WLDStats | null> {
  if (userName === "AI") return null;

  const pastGames = await getGames(
    userName,
    getPastTimestamp(timespan),
    true,
    currentGame.perfType,
  );

  return calculateWLDStats(pastGames, userName);
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
