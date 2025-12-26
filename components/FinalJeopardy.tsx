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
    setWagers(prev => ({ ...prev, [teamId]: 0 }));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
      
      <div className="bg-hol-gold text-hol-dark font-montserrat font-semibold px-8 py-3 rounded-full mb-10 shadow-xl uppercase tracking-[0.4em] text-xl">
        Final Jeopardy
      </div>

      <div className="bg-hol-dark border-4 border-hol-gold rounded-2xl w-full max-w-5xl shadow-2xl p-8 relative min-h-[500px] flex flex-col">
        
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          
          {step === 'CATEGORY' && (
             <div className="animate-in zoom-in duration-500">
               <h2 className="text-xl text-hol-gold font-montserrat font-semibold mb-6 uppercase tracking-[0.4em] opacity-60">Category</h2>
               <h1 className="text-5xl md:text-8xl font-montserrat font-semibold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] uppercase tracking-widest leading-tight">
                 {data.category}
               </h1>
             </div>
          )}

          {step === 'CLUE' && (
            <div className="animate-in slide-in-from-right duration-500 w-full">
              <div className="flex justify-center mb-8">
                 <div className={`flex items-center gap-3 font-mono text-5xl font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-hol-gold'}`}>
                    <Timer className="w-10 h-10" /> {timeLeft}s
                 </div>
              </div>
              <h2 className="text-3xl md:text-6xl font-lora text-white leading-tight mb-10 drop-shadow-lg">
                {data.clue}
              </h2>
              <button 
                onClick={handleSpeak}
                disabled={isSpeaking}
                className={`mx-auto flex items-center gap-2 px-6 py-3 rounded-full text-xs font-montserrat uppercase font-semibold tracking-widest ${isSpeaking ? 'bg-gray-700 text-gray-400' : 'bg-hol-dark border border-hol-gold text-hol-gold hover:bg-hol-gold hover:text-hol-dark'} transition-all`}
              >
                <Volume2 className="w-4 h-4" /> {isSpeaking ? 'Reading...' : 'Re-read Clue'}
              </button>
            </div>
          )}

          {(step === 'ANSWER' || step === 'SCORING') && (
            <div className="animate-in slide-in-from-bottom duration-500">
               <div className="mb-6">
                 <div className="text-hol-gold font-vibes text-4xl mb-6">The Response...</div>
                 <h1 className="text-3xl md:text-6xl font-lora text-white bg-green-900/40 p-10 rounded-2xl border-2 border-green-500/30 uppercase tracking-[0.2em] shadow-inner">
                   {data.answer}
                 </h1>
               </div>
            </div>
          )}

        </div>

        <div className="mt-12 pt-10 border-t border-gray-800 flex justify-center">
          
          {step === 'CATEGORY' && (
            <button 
              onClick={startClue}
              className="bg-hol-red hover:bg-red-600 text-white font-montserrat font-semibold py-4 px-10 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-widest"
            >
              Reveal Clue <Eye className="w-6 h-6" />
            </button>
          )}

          {step === 'CLUE' && (
            <button 
              onClick={() => { setStep('ANSWER'); setTimerActive(false); }}
              className="bg-hol-gold hover:bg-yellow-400 text-hol-dark font-montserrat font-semibold py-4 px-10 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-widest"
            >
              Reveal Answer <CheckCircle className="w-6 h-6" />
            </button>
          )}

          {step === 'ANSWER' && (
            <button 
              onClick={() => setStep('SCORING')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-montserrat font-semibold py-4 px-10 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-widest"
            >
              Final Scoring <DollarSign className="w-6 h-6" />
            </button>
          )}

        </div>
      </div>

      {step === 'SCORING' && (
        <div className="w-full max-w-5xl mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8">
           {teams.map(team => (
             <div key={team.id} className="bg-hol-dark border border-gray-700 p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                   <span className="font-montserrat font-semibold text-lg uppercase tracking-wider text-gray-200">{team.name}</span>
                   <span className="font-inter font-bold text-2xl text-hol-gold">${team.score}</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] text-gray-400 font-montserrat uppercase font-bold tracking-widest">Wager:</span>
                   <input 
                      type="number" 
                      placeholder="0"
                      value={wagers[team.id] || ''}
                      onChange={(e) => handleWagerChange(team.id, e.target.value)}
                      className="flex-1 bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white text-right font-mono focus:border-hol-gold outline-none transition-all"
                   />
                </div>
                <div className="flex gap-3 mt-1">
                   <button 
                      onClick={() => applyWager(team.id, false)}
                      className="flex-1 bg-red-900/30 hover:bg-red-800/50 border border-red-800/50 text-red-200 py-3 rounded-lg flex justify-center transition-all"
                   >
                      <XCircle className="w-6 h-6" />
                   </button>
                   <button 
                      onClick={() => applyWager(team.id, true)}
                      className="flex-1 bg-green-900/30 hover:bg-green-800/50 border border-green-800/50 text-green-200 py-3 rounded-lg flex justify-center transition-all"
                   >
                      <CheckCircle className="w-6 h-6" />
                   </button>
                </div>
             </div>
           ))}
           <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center mt-6">
              <button 
                onClick={onEndGame}
                className="bg-hol-green hover:bg-green-600 text-white font-montserrat font-semibold py-5 px-16 rounded-full text-2xl shadow-2xl transform hover:scale-105 transition-all flex items-center gap-4 uppercase tracking-[0.3em] border-4 border-white/20"
              >
                <Trophy className="w-10 h-10" />
                Finish Game
              </button>
           </div>
        </div>
      )}

    </div>
  );
};

export default FinalJeopardy;