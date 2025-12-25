import React from 'react';
import { Team } from '../types';
import { Users, Plus, Minus } from 'lucide-react';

interface ScoreBoardProps {
  teams: Team[];
  onUpdateScore: (teamId: number, delta: number) => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ teams, onUpdateScore }) => {
  return (
    <div className="flex justify-center gap-8 mt-6">
      {teams.map((team) => (
        <div key={team.id} className="relative bg-hol-red/90 border-2 border-hol-gold rounded-xl p-4 w-64 shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-hol-dark border border-hol-gold rounded-full p-2">
            <Users className="w-6 h-6 text-hol-gold" />
          </div>
          <h3 className="text-center font-christmas text-2xl mt-2 mb-2 font-bold tracking-wider text-hol-gold drop-shadow-sm">{team.name}</h3>
          <div className="text-center text-4xl font-slab font-bold mb-4 drop-shadow-md">
            ${team.score}
          </div>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => onUpdateScore(team.id, -200)}
              className="p-1 rounded-full hover:bg-red-900 transition-colors"
              aria-label="Decrease Score"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onUpdateScore(team.id, 200)}
              className="p-1 rounded-full hover:bg-red-900 transition-colors"
              aria-label="Increase Score"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreBoard;