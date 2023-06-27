import React from "react";
import "./Stats.css";

interface StatsProps {
  wins: number;
  losses: number;
  draws: number;
}

const Stats: React.FC<StatsProps> = ({ wins, losses, draws }) => {
  return (
    <div className="stats" title="Wins/Losses/Draws">
      <span className="wins">{wins}</span> /{" "}
      <span className="losses">{losses}</span> /{" "}
      <span className="draws">{draws}</span>
    </div>
  );
};

export default Stats;
