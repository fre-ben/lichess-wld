export interface Players {
  white: string;
  black: string;
}

export interface Game {
  players: Players;
  status: string;
  winner: "white" | "black";
}

export interface CurrentGame {
  id: string;
  players: { white: string; black: string };
  perfType: PerfType;
  rated: boolean;
}

export interface WLDStats {
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export type PerfType =
  | "ultraBullet"
  | "bullet"
  | "blitz"
  | "rapid"
  | "classical"
  | "correspondence"
  | "chess960"
  | "crazyhouse"
  | "antichess"
  | "atomic"
  | "horde"
  | "kingOfTheHill"
  | "racingKings"
  | "threeCheck";

export type BoardOrientation = "white" | "black";
