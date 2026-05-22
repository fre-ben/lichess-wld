import type { Settings } from "../types/settings";
import { DEFAULT_SETTINGS } from "../types/settings";

export async function getSettings(): Promise<Settings> {
  const [showWinRate, timespan] = await Promise.all([
    storage.getItem<boolean>("sync:showWinRate"),
    storage.getItem<6 | 12 | 24>("sync:timespan"),
  ]);

  return {
    showWinRate: showWinRate ?? DEFAULT_SETTINGS.showWinRate,
    timespan: timespan ?? DEFAULT_SETTINGS.timespan,
  };
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  const ops: Promise<void>[] = [];

  if (settings.showWinRate !== undefined) {
    ops.push(storage.setItem("sync:showWinRate", settings.showWinRate));
  }

  if (settings.timespan !== undefined) {
    ops.push(storage.setItem("sync:timespan", settings.timespan));
  }

  await Promise.all(ops);
}
