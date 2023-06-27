import type { CurrentGame, Game, PerfType, WLDStats } from "../types/lichess";

const HEADERS = {
  Accept: "application/x-ndjson",
};

const APIROUTE = "https://lichess.org/api";

export function getPastTimestamp(hours: number): number {
  return Date.now() - hours * 3600 * 1000;
}

export async function getGames(
  userName: string,
  since: number,
  rated: boolean,
  perfType?: PerfType
): Promise<Game[] | undefined> {
  try {
    const response = await fetch(
      `${APIROUTE}/games/user/${userName}?since=${since}&rated=${rated}&perfType=${perfType}`,
      {
        method: "GET",
        headers: HEADERS,
      }
    );

    const games = await parseXNDJSON(response);

    const cleanedGames: Game[] | undefined = games?.map((game) => {
      return {
        players: {
          white: game.players.white.user ? game.players.white.user.name : "AI",
          black: game.players.black.user ? game.players.black.user.name : "AI",
        },
        status: game.status,
        winner: game.winner,
      };
    });

    return cleanedGames;
  } catch (err) {
    console.error(
      `Lichess WLD: Error ocurred while fetching data for user: ${userName} - ${err}`
    );
    return undefined;
  }
}

export function calculateWLDStats(
  games: Game[] | undefined,
  userName: string
): WLDStats {
  let wins = 0;
  let losses = 0;
  let draws = 0;

  games?.forEach((game) => {
    const userColor =
      game.players.white.toLocaleLowerCase() === userName.toLocaleLowerCase()
        ? "white"
        : "black";

    if (game.status === "draw") {
      draws++;
    } else if (game.winner === userColor) {
      wins++;
    } else {
      losses++;
    }
  });

  return { wins, losses, draws };
}

export async function getCurrentGameById(): Promise<CurrentGame | undefined> {
  try {
    const gameID = window.location.href.split("/")[3];
    const response = await fetch(`${APIROUTE}/games/export/_ids`, {
      method: "POST",
      headers: HEADERS,
      // Limiting the string to 8 characters is required, since navigating away from a game and returning adds characters to the pathname, which results in an invalid gameID
      body: gameID.slice(0, 8),
    });

    const parsedGame = await parseXNDJSON(response);

    if (!parsedGame) {
      return;
    }

    const currentGame = parsedGame[0];

    const cleanedCurrentGame: CurrentGame = {
      id: currentGame.id,
      players: {
        white: currentGame.players.white.user
          ? currentGame.players.white.user.name
          : "AI",
        black: currentGame.players.black.user
          ? currentGame.players.black.user.name
          : "AI",
      },
      perfType: currentGame.perf,
      rated: currentGame.rated,
    };

    return cleanedCurrentGame;
  } catch (err) {
    console.error(`Lichess WLD: Error getting data for current game - ${err}`);
    return undefined;
  }
}

async function parseXNDJSON(response: Response) {
  return (await response.text()).match(/.+/g)?.map((any) => JSON.parse(any));
}
