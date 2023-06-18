import React from "react";

interface StatsProps {
  wins: number;
  losses: number;
  draws: number;
}

const Stats: React.FC<StatsProps> = ({ wins, losses, draws }) => {
  return (
    <p>
      {wins}/{losses}/{draws}
    </p>
  );
};

export default Stats;
