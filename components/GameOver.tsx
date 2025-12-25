import React, { useEffect, useState } from 'react';
import { Team } from '../types';
import { Trophy, RotateCcw, PartyPopper } from 'lucide-react';

interface GameOverProps {
  teams: Team[];
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ teams, onRestart }) => {
  const [winner, setWinner] = useState<Team | null>(null);

  useEffect(() => {
    // Determine winner(s)
    if (teams.length > 0) {
      const sorted = [...teams].sort((a, b) => b.score - a.score);
      setWinner(sorted[0]);
    }
  }, [teams]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 animate-in zoom-in duration-700">
      
      <div className="relative">
         {/* Background Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
         
         <div className="relative z-10 text-center">
            <Trophy className="w-32 h-32 text-hol-gold mx-auto mb-6 drop-shadow-lg" />
            
            <h2 className="text-2xl text-hol-red font-bold font-slab uppercase tracking-widest mb-2">Champion</h2>
            <h1 className="text-6xl md:text-8xl font-christmas text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-6">
               {winner?.name || "Everyone!"}
            </h1>
            <div className="text-4xl font-mono text-hol-gold font-bold mb-12">
               ${winner?.score || 0}
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 max-w-md mx-auto mb-12">
               <h3 className="text-gray-400 uppercase text-xs font-bold mb-4 tracking-wider">Final Standings</h3>
               {teams.sort((a,b) => b.score - a.score).map((team, idx) => (
                  <div key={team.id} className={`flex justify-between py-2 border-b border-gray-700 last:border-0 ${idx === 0 ? 'text-white font-bold' : 'text-gray-400'}`}>
                     <span>{idx + 1}. {team.name}</span>
                     <span>${team.score}</span>
                  </div>
               ))}
            </div>

            <button 
               onClick={onRestart}
               className="bg-white text-hol-dark hover:bg-gray-100 font-bold py-4 px-10 rounded-full shadow-xl flex items-center gap-2 mx-auto transition-all hover:scale-105"
            >
               <RotateCcw className="w-5 h-5" /> Play Again
            </button>
         </div>
      </div>
    </div>
  );
};

export default GameOver;