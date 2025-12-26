import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Question, Team } from '../types';
import { speakText, generateHint } from '../services/geminiService';
import { Timer, Volume2, Eye, XCircle, Lightbulb, Loader2 } from 'lucide-react';

interface ActiveClueProps {
  question: Question;
  teams: Team[];
  onClose: () => void;
  onAwardPoints: (teamId: number, points: number) => void;
}

const ActiveClue: React.FC<ActiveClueProps> = ({ question, teams, onClose, onAwardPoints }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

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

  const handleReveal = () => {
    setShowAnswer(true);
    setTimerActive(false);
  };

  const handleSpeak = useCallback(async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioBuffer = await speakText(question.clue);
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
  }, [question.clue, isSpeaking]);

  const handleGetHint = async () => {
    if (hint || loadingHint) return;
    setLoadingHint(true);
    const generatedHint = await generateHint(question.clue, question.answer);
    setHint(generatedHint);
    setLoadingHint(false);
  };

  useEffect(() => {
     handleSpeak();
  }, [handleSpeak]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-hol-dark border-4 border-hol-gold rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-hol-red p-4 flex justify-between items-center border-b-2 border-hol-gold">
          <div className="text-hol-gold font-montserrat font-semibold text-3xl drop-shadow-sm">${question.value}</div>
          <div className="flex items-center gap-4">
             <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                <Timer className="w-6 h-6" />
                {timeLeft}s
             </div>
             <button 
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
             >
                <XCircle className="w-8 h-8" />
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-12 flex flex-col items-center justify-center text-center relative bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">
          
          <div className="mb-6 w-full">
            <h2 className="text-3xl md:text-5xl font-slab font-bold text-white leading-tight drop-shadow-lg uppercase">
              {question.clue}
            </h2>
          </div>

          {(hint || loadingHint) && !showAnswer && (
             <div className="mb-6 animate-in slide-in-from-top-2">
                <div className="bg-blue-900/50 border border-blue-500/50 rounded-lg p-4 max-w-xl mx-auto backdrop-blur-md">
                   {loadingHint ? (
                     <div className="flex items-center justify-center gap-2 text-blue-200 font-montserrat uppercase font-semibold text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" /> Thinking of a hint...
                     </div>
                   ) : (
                     <div className="text-blue-100 font-slab text-lg italic">
                        <Lightbulb className="w-4 h-4 inline-block mr-2 text-yellow-400" />
                        "{hint}"
                     </div>
                   )}
                </div>
             </div>
          )}

          {showAnswer && (
            <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-hol-gold font-vibes text-4xl mb-3">The Response</div>
              <h3 className="text-2xl md:text-4xl font-montserrat font-semibold text-yellow-300 uppercase tracking-widest bg-black/30 px-6 py-3 rounded-lg border border-hol-gold/20">
                {question.answer}
              </h3>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={handleSpeak}
              disabled={isSpeaking}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all font-montserrat uppercase text-sm tracking-widest ${isSpeaking ? 'bg-gray-600 text-gray-400' : 'bg-hol-green text-white hover:bg-green-700 hover:scale-105 shadow-lg shadow-green-900/30'}`}
            >
              <Volume2 className="w-5 h-5" />
              {isSpeaking ? 'Reading...' : 'Re-Read Clue'}
            </button>
            
            {!showAnswer && !hint && !loadingHint && (
               <button 
                  onClick={handleGetHint}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 hover:scale-105 transition-all shadow-lg shadow-blue-500/20 font-montserrat uppercase text-sm tracking-widest"
               >
                  <Lightbulb className="w-5 h-5" />
                  Need a Hint?
               </button>
            )}

            {!showAnswer && (
              <button
                onClick={handleReveal}
                className="flex items-center gap-2 px-6 py-3 bg-hol-gold text-hol-dark rounded-full font-bold hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg shadow-yellow-500/20 font-montserrat uppercase text-sm tracking-widest"
              >
                <Eye className="w-5 h-5" />
                Reveal Answer
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-900/80 p-6 border-t border-hol-gold/30">
          <div className="text-center text-gray-400 text-[10px] mb-4 font-montserrat uppercase font-bold tracking-[0.3em]">Award points to</div>
          <div className="flex flex-wrap justify-center gap-4">
            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => {
                  onAwardPoints(team.id, question.value);
                  onClose();
                }}
                className="group relative flex items-center gap-3 px-5 py-2.5 bg-hol-dark border border-hol-green rounded-lg hover:bg-hol-green transition-all font-montserrat"
              >
                <span className="text-white font-bold text-sm tracking-wide">{team.name}</span>
                <span className="bg-hol-gold text-hol-dark text-[10px] font-bold px-2 py-0.5 rounded-full group-hover:bg-white transition-colors">
                  +${question.value}
                </span>
              </button>
            ))}
             <button
                onClick={() => onClose()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-all text-gray-400 font-montserrat text-sm uppercase font-semibold tracking-wider"
              >
                No Winner
              </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActiveClue;