import React from "react";
import "./Stats.css";

interface StatsProps {
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  showWinRate: boolean;
  loading?: boolean;
}

const Stats: React.FC<StatsProps> = ({ wins, losses, draws, winRate, showWinRate, loading }) => {
  return (
    <div className="wld-stats" title="Wins/Losses/Draws">
      <span className="wld-wins">{wins}</span> /{" "}
      <span className="wld-losses">{losses}</span> /{" "}
      <span className="wld-draws">{draws}</span>{" "}
      {showWinRate && <span className="wld-winrate">{winRate}%</span>}
      {loading && <span className="wld-loading" title="Updating stats…">↻</span>}
    </div>
  );
};

export default Stats;
