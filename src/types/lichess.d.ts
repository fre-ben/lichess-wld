export interface Game {
  players: Players;
  status: string;
  winner: "white" | "black";
}

export interface CurrentGame {
  id: string;
  players: Players;
  perfType: PerfType;
  rated: boolean;
}

export interface WLDStats {
  wins: number;
  losses: number;
  draws: number;
}

export interface Players {
  white: string;
  black: string;
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
