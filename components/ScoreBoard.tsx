import React from 'react';
import { Team } from '../types';
import { Users, Plus, Minus } from 'lucide-react';

interface ScoreBoardProps {
  teams: Team[];
  onUpdateScore: (teamId: number, delta: number) => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ teams, onUpdateScore }) => {
  return (
    <div className="w-full px-2 mt-4">
      <div className="flex justify-center items-stretch gap-2 md:gap-4 w-full max-w-7xl mx-auto">
        {teams.map((team) => (
          <div 
            key={team.id} 
            className="relative bg-hol-red/90 border-2 border-hol-gold rounded-xl p-2 md:p-4 flex-1 min-w-0 max-w-[220px] shadow-lg text-white transform hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="absolute -top-3 md:-top-5 left-1/2 -translate-x-1/2 bg-hol-dark border border-hol-gold rounded-full p-1 md:p-2 shadow-md z-10">
              <Users className="w-3 h-3 md:w-5 md:h-5 text-hol-gold" />
            </div>
            
            <div className="mt-2 md:mt-4 text-center w-full">
              <h3 className="font-montserrat text-xs md:text-sm lg:text-base font-bold tracking-wider text-hol-gold drop-shadow-sm truncate px-1" title={team.name}>
                {team.name}
              </h3>
              <div className="text-xl md:text-3xl font-slab font-bold my-1 md:my-2 drop-shadow-md truncate">
                ${team.score}
              </div>
            </div>

            <div className="flex justify-center gap-2 md:gap-3 mt-1 w-full">
              <button 
                onClick={() => onUpdateScore(team.id, -200)}
                className="p-1 md:p-1.5 rounded-full hover:bg-red-900 transition-colors bg-black/20 flex-shrink-0"
                aria-label="Decrease Score"
              >
                <Minus className="w-3 h-3 md:w-4 md:h-4" />
              </button>
              <button 
                onClick={() => onUpdateScore(team.id, 200)}
                className="p-1 md:p-1.5 rounded-full hover:bg-red-900 transition-colors bg-black/20 flex-shrink-0"
                aria-label="Increase Score"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard;