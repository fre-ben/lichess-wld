export interface Settings {
  showWinRate: boolean;
  timespan: 6 | 12 | 24;
}

export const DEFAULT_SETTINGS: Settings = {
  showWinRate: true,
  timespan: 12,
};
