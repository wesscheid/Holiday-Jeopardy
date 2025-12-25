import React, { useState, useEffect, useRef } from 'react';
import { FinalJeopardyQuestion, Team } from '../types';
import { speakText } from '../services/geminiService';
import { Timer, Volume2, Eye, CheckCircle, Trophy, DollarSign, Plus, Minus, XCircle } from 'lucide-react';

interface FinalJeopardyProps {
  data: FinalJeopardyQuestion;
  teams: Team[];
  onUpdateScore: (teamId: number, delta: number) => void;
  onEndGame: () => void;
}

type Step = 'CATEGORY' | 'CLUE' | 'ANSWER' | 'SCORING';

const FinalJeopardy: React.FC<FinalJeopardyProps> = ({ data, teams, onUpdateScore, onEndGame }) => {
  const [step, setStep] = useState<Step>('CATEGORY');
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wagers, setWagers] = useState<{[key: number]: number}>({});

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, timerActive]);

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioBuffer = await speakText(data.clue);
      if (audioBuffer) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
        source.onended = () => setIsSpeaking(false);
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error(e);
      setIsSpeaking(false);
    }
  };

  const startClue = () => {
    setStep('CLUE');
    setTimerActive(true);
    handleSpeak();
  };

  const handleWagerChange = (teamId: number, value: string) => {
    const num = parseInt(value) || 0;
    setWagers(prev => ({ ...prev, [teamId]: num }));
  };

  const applyWager = (teamId: number, isCorrect: boolean) => {
    const amount = wagers[teamId] || 0;
    onUpdateScore(teamId, isCorrect ? amount : -amount);
    // Visual feedback could be added here, but simplest is to zero out wager to prevent double submission
    setWagers(prev => ({ ...prev, [teamId]: 0 }));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
      
      {/* Header Badge */}
      <div className="bg-hol-gold text-hol-dark font-bold px-6 py-2 rounded-full mb-8 shadow-lg uppercase tracking-widest text-xl">
        Final Jeopardy
      </div>

      <div className="bg-hol-dark border-4 border-hol-gold rounded-2xl w-full max-w-5xl shadow-2xl p-8 relative min-h-[500px] flex flex-col">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          
          {step === 'CATEGORY' && (
             <div className="animate-in zoom-in duration-500">
               <h2 className="text-2xl text-hol-gold font-slab mb-4 uppercase tracking-wider">Category</h2>
               <h1 className="text-4xl md:text-6xl font-christmas text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                 {data.category}
               </h1>
             </div>
          )}

          {step === 'CLUE' && (
            <div className="animate-in slide-in-from-right duration-500 w-full">
              <div className="flex justify-center mb-6">
                 <div className={`flex items-center gap-2 font-mono text-4xl font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-hol-gold'}`}>
                    <Timer className="w-8 h-8" /> {timeLeft}s
                 </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-slab font-bold text-white leading-tight mb-8">
                {data.clue}
              </h2>
              <button 
                onClick={handleSpeak}
                disabled={isSpeaking}
                className={`mx-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm ${isSpeaking ? 'bg-gray-700 text-gray-400' : 'bg-hol-dark border border-hol-gold text-hol-gold hover:bg-hol-gold hover:text-hol-dark'} transition-colors`}
              >
                <Volume2 className="w-4 h-4" /> Re-read
              </button>
            </div>
          )}

          {(step === 'ANSWER' || step === 'SCORING') && (
            <div className="animate-in slide-in-from-bottom duration-500">
               <div className="mb-6">
                 <div className="text-hol-gold font-slab text-xl mb-2">The Correct Response Is...</div>
                 <h1 className="text-3xl md:text-5xl font-bold text-white bg-green-900/50 p-6 rounded-xl border border-green-500/30">
                   {data.answer}
                 </h1>
               </div>
            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex justify-center">
          
          {step === 'CATEGORY' && (
            <button 
              onClick={startClue}
              className="bg-hol-red hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
            >
              Reveal Clue <Eye className="w-5 h-5" />
            </button>
          )}

          {step === 'CLUE' && (
            <button 
              onClick={() => { setStep('ANSWER'); setTimerActive(false); }}
              className="bg-hol-gold hover:bg-yellow-400 text-hol-dark font-bold py-3 px-8 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
            >
              Reveal Answer <CheckCircle className="w-5 h-5" />
            </button>
          )}

          {step === 'ANSWER' && (
            <button 
              onClick={() => setStep('SCORING')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
            >
              Final Scoring <DollarSign className="w-5 h-5" />
            </button>
          )}

        </div>
      </div>

      {/* Scoring Section - Only visible in SCORING step */}
      {step === 'SCORING' && (
        <div className="w-full max-w-5xl mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-bottom-8">
           {teams.map(team => (
             <div key={team.id} className="bg-hol-dark border border-gray-600 p-4 rounded-xl flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                   <span className="font-bold text-lg">{team.name}</span>
                   <span className="font-mono text-xl text-hol-gold">${team.score}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-xs text-gray-400">Wager:</span>
                   <input 
                      type="number" 
                      placeholder="0"
                      value={wagers[team.id] || ''}
                      onChange={(e) => handleWagerChange(team.id, e.target.value)}
                      className="flex-1 bg-black/30 border border-gray-600 rounded px-2 py-1 text-white text-right font-mono"
                   />
                </div>
                <div className="flex gap-2 mt-1">
                   <button 
                      onClick={() => applyWager(team.id, false)}
                      className="flex-1 bg-red-900/50 hover:bg-red-800 border border-red-800 text-red-200 py-2 rounded flex justify-center"
                      title="Incorrect"
                   >
                      <XCircle className="w-5 h-5" />
                   </button>
                   <button 
                      onClick={() => applyWager(team.id, true)}
                      className="flex-1 bg-green-900/50 hover:bg-green-800 border border-green-800 text-green-200 py-2 rounded flex justify-center"
                      title="Correct"
                   >
                      <CheckCircle className="w-5 h-5" />
                   </button>
                </div>
             </div>
           ))}
           <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center mt-4">
              <button 
                onClick={onEndGame}
                className="bg-hol-green hover:bg-green-600 text-white font-bold py-4 px-12 rounded-full text-2xl shadow-xl transform hover:scale-105 transition-all flex items-center gap-3"
              >
                <Trophy className="w-8 h-8" />
                Finish Game
              </button>
           </div>
        </div>
      )}

    </div>
  );
};

export default FinalJeopardy;