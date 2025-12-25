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
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-hol-gold/10 rounded-full blur-[120px] animate-pulse"></div>
         
         <div className="relative z-10 text-center">
            <Trophy className="w-40 h-40 text-hol-gold mx-auto mb-8 drop-shadow-[0_10px_20px_rgba(245,158,11,0.3)]" />
            
            <h2 className="text-2xl text-hol-red font-bold font-montserrat uppercase tracking-[0.5em] mb-4">Champion</h2>
            <h1 className="text-5xl md:text-8xl font-bebas text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-4 tracking-widest">
               {winner?.name || "Everyone!"}
            </h1>
            <div className="text-5xl font-mono text-hol-gold font-bold mb-14 drop-shadow-md">
               ${winner?.score || 0}
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-gray-800 max-w-lg mx-auto mb-14 shadow-2xl">
               <h3 className="text-gray-500 uppercase text-xs font-bold mb-6 tracking-[0.4em] font-montserrat">Final Standings</h3>
               <div className="space-y-4">
                 {teams.sort((a,b) => b.score - a.score).map((team, idx) => (
                    <div key={team.id} className={`flex justify-between items-center py-3 border-b border-gray-800/50 last:border-0 ${idx === 0 ? 'text-white font-bold scale-105' : 'text-gray-400'}`}>
                       <span className="font-montserrat uppercase tracking-wider text-sm">
                         {idx + 1}. {team.name}
                       </span>
                       <span className="font-mono text-xl">${team.score}</span>
                    </div>
                 ))}
               </div>
            </div>

            <button 
               onClick={onRestart}
               className="bg-white text-hol-dark hover:bg-gray-200 font-bold py-5 px-14 rounded-full shadow-2xl flex items-center gap-3 mx-auto transition-all hover:scale-105 font-montserrat uppercase tracking-widest text-lg"
            >
               <RotateCcw className="w-6 h-6" /> Play Again
            </button>
         </div>
      </div>
    </div>
  );
};

export default GameOver;