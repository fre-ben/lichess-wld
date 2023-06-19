import type { Game, WLDStats } from "../types/lichess";

export function getPastTimestamp(hours: number): number {
  return Date.now() - hours * 3600 * 1000;
}

export async function getGames(
  userName: string,
  since: number
): Promise<Game[] | undefined> {
  const headers = {
    Accept: "application/x-ndjson",
  };

  const response = await fetch(
    `https://lichess.org/api/games/user/${userName}?since=${since}&rated=true`,
    {
      method: "GET",
      headers: headers,
    }
  );

  // parse x-ndjson response
  const games = (await response.text())
    .match(/.+/g)
    ?.map((game) => JSON.parse(game));

  const cleanedGames: Game[] | undefined = games?.map((game) => {
    return {
      players: {
        white: game.players.white.user.name,
        black: game.players.black.user.name,
      },
      status: game.status,
      winner: game.winner,
    };
  });

  return cleanedGames;
}

function calculateWLDStats(games: Game[], userName: string): WLDStats {
  let wins = 0;
  let losses = 0;
  let draws = 0;

  games.forEach((game) => {
    const userColor =
      game.players.white.toLocaleLowerCase() === userName.toLocaleLowerCase()
        ? "white"
        : "black";

    if (game.status === "draw") {
      draws++;
      return;
    } else if (game.winner === userColor) {
      wins++;
      return;
    } else {
      losses++;
      return;
    }
  });

  return { wins, losses, draws };
}

export async function getCurrentGame() {
  // TODO
  return;
}

// TODO: Fetch um den aktuellen gamemode zu bekommen und als perfType in den getGames fetch mitzugeben
// TODO: Fetch um die Spielernamen zu bekommen -> zusammen mit gamemode aus current-game Endpunkt ziehen
// TODO: FUnktion um aus den Games die W/L/D zu ziehen -> draws mitzählen

// BeispielResponse:
// [
//   {
//     id: "XRpE0a1j",
//     rated: true,
//     variant: "standard",
//     speed: "rapid",
//     perf: "rapid",
//     createdAt: 1687025762557,
//     lastMoveAt: 1687026311202,
//     status: "resign",
//     players: {
//       white: {
//         user: {
//           name: "SchachmannVomBrett",
//           patron: true,
//           id: "schachmannvombrett",
//         },
//         rating: 966,
//         ratingDiff: 6,
//       },
//       black: {
//         user: {
//           name: "ESLAMM66",
//           id: "eslamm66",
//         },
//         rating: 1015,
//         ratingDiff: -6,
//       },
//     },
//     winner: "white",
//     moves:
//       "d4 e5 e3 exd4 exd4 Bb4+ c3 Bd6 g3 Qe7+ Be3 Nf6 Nf3 Ne4 Nbd2 Nxf2 Kxf2 O-O Nc4 Re8 Bg5 f6 Bh4 g5 Nxg5 fxg5 Qg4 Qf6+ Kg2 c5 Qxg5+ Qxg5 Bxg5 Nc6 Nxd6 h6 Nxe8 hxg5 Bc4+ Kf8 Nd6 Ne7 Rhf1+ Kg7 Rf7+ Kg6 Rxe7",
//     clock: {
//       initial: 600,
//       increment: 0,
//       totalTime: 600,
//     },
//   },
//   {
//     id: "aKczKIoH",
//     rated: true,
//     variant: "standard",
//     speed: "rapid",
//     perf: "rapid",
//     createdAt: 1686991915973,
//     lastMoveAt: 1686992754392,
//     status: "resign",
//     players: {
//       white: {
//         user: {
//           name: "SchachmannVomBrett",
//           patron: true,
//           id: "schachmannvombrett",
//         },
//         rating: 958,
//         ratingDiff: 8,
//       },
//       black: {
//         user: {
//           name: "FG53WBHS",
//           id: "fg53wbhs",
//         },
//         rating: 1057,
//         ratingDiff: -7,
//       },
//     },
//     winner: "white",
//     moves:
//       "d4 d5 Bf4 Bf5 e3 Nc6 c3 e6 Nf3 Nf6 h3 Bd6 Bg3 O-O Bd3 b5 a3 b4 axb4 a5 Qa4 Nd7 b5 Na7 Qxa5 c5 Qxd8 Rfxd8 Ra6 Nxb5 Bxb5 Rxa6 Bxa6 Ra8 Bb5 Nb6 Bxd6 Ra1 O-O Nc8 dxc5 Bd3 Nbd2 Bxf1 Nxf1 Ra5 Bd3 h6 Bc7 Rxc5 Be5 Ne7 b4 Rc8 Bd6 Ng6 Bxg6 fxg6 Ne5 Rxc3 b5 Rb3 Nd2 Rxb5 Nxg6 Rb2 Ne7+ Kf7 Nf3 Rb1+ Kh2 Kf6 Be5+ Kxe7 Bxg7 h5 g4 hxg4 hxg4 Rb2 Kg2 Kf7 Bxb2",
//     clock: {
//       initial: 600,
//       increment: 0,
//       totalTime: 600,
//     },
//   },
//   {
//     id: "s5hRkrpE",
//     rated: true,
//     variant: "standard",
//     speed: "rapid",
//     perf: "rapid",
//     createdAt: 1686941343070,
//     lastMoveAt: 1686942167940,
//     status: "mate",
//     players: {
//       white: {
//         user: {
//           name: "Silstar",
//           id: "silstar",
//         },
//         rating: 1084,
//         ratingDiff: -8,
//       },
//       black: {
//         user: {
//           name: "SchachmannVomBrett",
//           patron: true,
//           id: "schachmannvombrett",
//         },
//         rating: 951,
//         ratingDiff: 7,
//       },
//     },
//     winner: "black",
//     moves:
//       "e4 e5 Nf3 Nc6 Nc3 Bc5 Nxe5 Nf6 d3 O-O Nxc6 dxc6 Be2 b5 O-O b4 Na4 Bd4 h3 Rb8 c3 Be5 cxb4 Rxb4 Nc5 Qe7 a3 Rb5 d4 Bd6 Bxb5 cxb5 e5 Bxe5 dxe5 Qxe5 b4 Qxa1 Re1 h6 Nb3 Qc3 Re3 Qc6 Nd4 Qd5 Rd3 Bb7 Nb3 Qxg2#",
//     clock: {
//       initial: 600,
//       increment: 0,
//       totalTime: 600,
//     },
//   },
//   {
//     id: "mA5vuExS",
//     rated: true,
//     variant: "standard",
//     speed: "rapid",
//     perf: "rapid",
//     createdAt: 1686930877875,
//     lastMoveAt: 1686931780323,
//     status: "mate",
//     players: {
//       white: {
//         user: {
//           name: "SchachmannVomBrett",
//           patron: true,
//           id: "schachmannvombrett",
//         },
//         rating: 955,
//         ratingDiff: -4,
//       },
//       black: {
//         user: {
//           name: "yagizefesay45",
//           id: "yagizefesay45",
//         },
//         rating: 1050,
//         ratingDiff: 4,
//       },
//     },
//     winner: "black",
//     moves:
//       "e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Bc5 O-O d6 Nc3 Nd4 Ng5 O-O Re1 Bg4 Qd2 Nh5 h3 h6 hxg4 hxg5 gxh5 g4 h6 gxh6 Qxh6 Nxc2 Bg5 Qe8 Nd5 Nxa1 Nxc7 Qc8 Nxa8 Qxa8 Qf6 g3 Bxf7+ Rxf7 Qg6+ Kf8 Qh6+ Ke8 Qh8+ Rf8 Qh5+ Rf7 Rxa1 Kd7 Qxf7+ Kc6 Rc1 gxf2+ Kf1 Qh8 Qd5+ Kb6 Qb3+ Kc7 d4 exd4 e5 Qxe5 Bd8+ Kxd8 Qxb7 d3 Qb8+ Kd7 Qxa7+ Ke6 Rxc5 dxc5 Qb6+ Kd5 Qb3+ c4 Qb5+ Kd4 Qxe5+ Kxe5 a4 d2 a5 d1=Q+ Kxf2 Qd2+ Kf1 Qxa5 Kf2 Qb5 Kf1 c3+ Kf2 cxb2 g3 b1=Q g4 Q5b2+ Kf3 Qe4+ Kg3 Qbg2+ Kh4 Qexg4#",
//     clock: {
//       initial: 600,
//       increment: 0,
//       totalTime: 600,
//     },
//   },
//   {
//     id: "pFAXXg3W",
//     rated: true,
//     variant: "standard",
//     speed: "rapid",
//     perf: "rapid",
//     createdAt: 1686929862687,
//     lastMoveAt: 1686930829132,
//     status: "resign",
//     players: {
//       white: {
//         user: {
//           name: "SchachmannVomBrett",
//           patron: true,
//           id: "schachmannvombrett",
//         },
//         rating: 960,
//         ratingDiff: -5,
//       },
//       black: {
//         user: {
//           name: "paneor",
//           id: "paneor",
//         },
//         rating: 978,
//         ratingDiff: 5,
//       },
//     },
//     winner: "black",
//     moves:
//       "d4 d5 Bf4 Nf6 e3 Nc6 Bd3 e6 Nf3 Bb4+ c3 Ba5 Nbd2 O-O h4 Ng4 g3 f6 Nh2 f5 Ndf3 Qe7 b4 Bb6 Ng5 h6 e4 Nxd4 cxd4 Bxd4 O-O Bxa1 Qxa1 Nxh2 Kxh2 dxe4 Bc4 Bd7 Qe5 Rac8 Bxe6+ Bxe6 Nxe6 Rf6 Nxg7 Qxg7 Qd5+ Kh7 Qxb7 Rg8 Qxa7 c6 a4 Qxa7 a5 Qd4 a6 Qxb4 Ra1 Qd4 a7 Qxa1",
//     clock: {
//       initial: 600,
//       increment: 0,
//       totalTime: 600,
//     },
//   },
//   {
//     id: "1fjyqwcU",
//     rated: true,
//     variant: "standard",
//     speed: "rapid",
//     perf: "rapid",
//     createdAt: 1686928372554,
//     lastMoveAt: 1686929580153,
//     status: "outoftime",
//     players: {
//       white: {
//         user: {
//           name: "SchachmannVomBrett",
//           patron: true,
//           id: "schachmannvombrett",
//         },
//         rating: 955,
//         ratingDiff: 5,
//       },
//       black: {
//         user: {
//           name: "Kure91",
//           id: "kure91",
//         },
//         rating: 906,
//         ratingDiff: -5,
//       },
//     },
//     winner: "white",
//     moves:
//       "d4 d5 Bf4 Nc6 e3 Bf5 Bd3 Bg6 c3 e6 Nf3 Bd6 Bg3 Na5 Qa4+ Nc6 Nbd2 Nf6 Nb3 O-O Na5 Nxa5 Qxa5 b6 Qb5 Bxg3 hxg3 c6 Qxc6 Bxd3 O-O-O Be2 Rde1 Bxf3 gxf3 Rc8 Qb7 a5 g4 Rb8 Qc6 Rc8 Qb5 Rb8 g5 Nd7 Qd3 g6 f4 Rc8 e4 dxe4 Rxe4 f5 Rxe6 Re8 Qc4 Rxc4 b3 Rxc3+ Kb2 Rf3 Rd6 Rxf2+ Ka3 Rxf4 d5 b5 Ra6 Qxg5 Rxa5 b4+ Ka4 Nb6+ Kb5 Rb8 Ka6 Ra8+ Kxb6 Qf6+ Kb7 Qe7+ Kxa8 Qd8+ Ka7",
//     clock: {
//       initial: 600,
//       increment: 0,
//       totalTime: 600,
//     },
//   },
//   {
//     id: "2qzteUaY",
//     rated: true,
//     variant: "standard",
//     speed: "rapid",
//     perf: "rapid",
//     createdAt: 1686865043980,
//     lastMoveAt: 1686866267580,
//     status: "outoftime",
//     players: {
//       white: {
//         user: {
//           name: "danny_bugingo",
//           id: "danny_bugingo",
//         },
//         rating: 882,
//         ratingDiff: -14,
//       },
//       black: {
//         user: {
//           name: "SchachmannVomBrett",
//           patron: true,
//           id: "schachmannvombrett",
//         },
//         rating: 950,
//         ratingDiff: 5,
//       },
//     },
//     winner: "black",
//     moves:
//       "Nc3 e5 Nf3 d5 d4 e4 Ne5 f6 Nf7 Kxf7 Bf4 g5 Bg3 Nc6 e3 Bf5 Nb5 Rc8 Qh5+ Bg6 Qg4 Nh6 Qe2 Nb4 a3 c6 Nxa7 Ra8 axb4 Qb6 f4 Rxa7 Rxa7 Qxa7 fxg5 Bxb4+ c3 Qa1+ Qd1 Qxb2 cxb4 Qc3+ Qd2 Qa1+ Ke2 fxg5 h4 Rf8 hxg5 Ra8 Rxh6 Ra2 Be1 Rxd2+ Bxd2 Kg7 g4 Qb1 Rh5 Qd3+ Ke1 Bxh5 Bxd3 Bxg4 Bc3 Kg6 Bf1 Kxg5 Bg2 h5 Bh1 h4 Bd2 h3 Bc1 Kh4 Bd2 b5 Kf1 h2 Kg2 Bh3+ Kxh2 Kg4 Bc3 Kh4 Be1+ Kg4 Bf2 Kg5 Bg3 Kg6 Bb8 Kg7 Bc7 Kg8 Bb6 Kg7",
//     clock: {
//       initial: 600,
//       increment: 0,
//       totalTime: 600,
//     },
//   },
//   {
//     id: "GxOIZrD7",
//     rated: true,
//     variant: "standard",
//     speed: "rapid",
//     perf: "rapid",
//     createdAt: 1686864178282,
//     lastMoveAt: 1686865018392,
//     status: "mate",
//     players: {
//       white: {
//         user: {
//           name: "bozayi26",
//           id: "bozayi26",
//         },
//         rating: 943,
//         ratingDiff: 7,
//       },
//       black: {
//         user: {
//           name: "SchachmannVomBrett",
//           patron: true,
//           id: "schachmannvombrett",
//         },
//         rating: 956,
//         ratingDiff: -6,
//       },
//     },
//     winner: "white",
//     moves:
//       "e4 e5 Nf3 Nc6 Bc4 d6 b3 f5 exf5 Bxf5 Bb2 e4 Ng1 Nf6 Na3 a6 Qe2 Nb4 f3 Qe7 g4 Be6 g5 Nh5 fxe4 Qxg5 Bxe6 Nf4 Nf3 Nxe2 Nxg5 Nf4 Bf7+ Ke7 O-O-O Nxa2+ Kb1 Nb4 Rhf1 h6 Rxf4 hxg5 Rg4 Rh5 Bxh5 d5 Rxg5 dxe4 c3 Nd3 c4 Nf2 Re1 Nh3 Rxe4+ Kd7 Rd5+ Kc6 Be8+ Kb6 Re6+ Ka7 Bd4+ b6 c5 Nf4 cxb6+ Kb7 Be5 Nxd5 bxc7 Nxc7 Bc6+ Kc8 Bxc7 Ra7 Bb6 Rf7 Re8#",
//     clock: {
//       initial: 600,
//       increment: 0,
//       totalTime: 600,
//     },
//   },
//   {
//     id: "ut6H5pyz",
//     rated: true,
//     variant: "standard",
//     speed: "rapid",
//     perf: "rapid",
//     createdAt: 1686862961576,
//     lastMoveAt: 1686864099065,
//     status: "mate",
//     players: {
//       white: {
//         user: {
//           name: "SchachmannVomBrett",
//           patron: true,
//           id: "schachmannvombrett",
//         },
//         rating: 962,
//         ratingDiff: -6,
//       },
//       black: {
//         user: {
//           name: "Bullers100",
//           id: "bullers100",
//         },
//         rating: 960,
//         ratingDiff: 6,
//       },
//     },
//     winner: "black",
//     moves:
//       "d4 d5 Bf4 f6 e3 e5 Bg3 Nc6 Nf3 Bb4+ c3 Ba5 Bd3 Bg4 h3 Bh5 Nbd2 g6 Bb5 f5 Nxe5 Ne7 Qa4 f4 Bh4 Bb6 exf4 Rf8 Nxg6 hxg6 g3 Qd7 O-O g5 Bxg5 Bg6 Rfe1 a6 Rxe7+ Qxe7 Bxe7 Kxe7 Qb4+ Nxb4 cxb4 axb5 Re1+ Kd7 Re5 c6 Rg5 Bd3 Rg7+ Kc8 g4 Rxa2 f5 Rxb2 Nf3 Rxb4 Kg2 Be2 Ne5 Rxd4 Kg3 Bc7 f4 b4 Kh4 Bd8+ g5 Rxf4+ Kg3 R4xf5 Ng6 Re8 h4 b3 Nf4 Bd1 g6 b2 h5 b1=Q Ne6 Qb3+ Kg2 Qf3+ Kg1 Bb6+ Kh2 Rxh5#",
//     clock: {
//       initial: 600,
//       increment: 0,
//       totalTime: 600,
//     },
//   },
// ];
