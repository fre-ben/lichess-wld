export interface Game {
  players: { white: string; black: string };
  status: string;
  winner: "white" | "black";
}

export interface WLDStats {
  wins: number;
  losses: number;
  draws: number;
}
