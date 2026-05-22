import React from "react";
import "./Stats.css";

interface StatsProps {
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

const Stats: React.FC<StatsProps> = ({ wins, losses, draws, winRate }) => {
  return (
    <div className="wld-stats" title="Wins/Losses/Draws">
      <span className="wld-wins">{wins}</span> /{" "}
      <span className="wld-losses">{losses}</span> /{" "}
      <span className="wld-draws">{draws}</span>{" "}
      <span className="wld-winrate">{winRate}%</span>
    </div>
  );
};

export default Stats;
