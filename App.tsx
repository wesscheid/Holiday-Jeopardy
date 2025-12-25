import React, { useState, useEffect } from 'react';
import { GameState, GameData, Question, Team } from './types';
import { generateGameData } from './services/geminiService';
import GameBoard from './components/GameBoard';
import ActiveClue from './components/ActiveClue';
import ScoreBoard from './components/ScoreBoard';
import FinalJeopardy from './components/FinalJeopardy';
import GameOver from './components/GameOver';
import Snowfall from './components/Snowfall';
import { FALLBACK_GAME_DATA } from './constants';
import { Gift, Loader2, Play, Plus, Trash2, ArrowRight, Maximize, Minimize, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [customTopic, setCustomTopic] = useState("Christmas Traditions");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: "The Elves", score: 0 },
    { id: 2, name: "The Reindeer", score: 0 }
  ]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const startGame = async () => {
    setError(null);
    setGameState(GameState.LOADING);
    try {
      const data = await generateGameData(customTopic);
      setGameData(data);
      setGameState(GameState.PLAYING);
    } catch (err: any) {
      console.error("Game generation failed:", err);
      const isApiKeyMissing = err.message?.includes("API Key") || (typeof process !== 'undefined' && !process.env.API_KEY);
      
      const errorMsg = isApiKeyMissing
        ? "API Key missing in build. Using fallback holiday board. (Check GitHub Secrets!)"
        : "Failed to build board for this topic. Using holiday defaults.";
      
      setError(errorMsg);
      setGameData(JSON.parse(JSON.stringify(FALLBACK_GAME_DATA)));
      setGameState(GameState.PLAYING);
    }
  };

  const handleQuestionClick = (question: Question) => {
    setActiveQuestion(question);
  };

  const handleCloseModal = () => {
    if (activeQuestion && gameData) {
      const newData = { ...gameData };
      for (const cat of newData.categories) {
        const qIndex = cat.questions.findIndex(q => q.id === activeQuestion.id);
        if (qIndex !== -1) {
          cat.questions[qIndex].isAnswered = true;
          break;
        }
      }
      setGameData(newData);
    }
    setActiveQuestion(null);
  };

  const handleUpdateScore = (teamId: number, delta: number) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, score: t.score + delta } : t));
  };

  const addTeam = () => {
    if (teams.length < 5) {
      const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
      setTeams([...teams, { id: newId, name: `Team ${teams.length + 1}`, score: 0 }]);
    }
  };

  const removeTeam = (id: number) => {
    if (teams.length > 1) {
      setTeams(teams.filter(t => t.id !== id));
    }
  };

  const checkAllQuestionsAnswered = () => {
    if (!gameData) return false;
    return gameData.categories.every(c => c.questions.every(q => q.isAnswered));
  };

  const resetGame = () => {
     setGameState(GameState.SETUP);
     setGameData(null);
     setError(null);
     setTeams([
        { id: 1, name: "The Elves", score: 0 },
        { id: 2, name: "The Reindeer", score: 0 }
     ]);
     setCustomTopic("Christmas Traditions");
  };

  return (
    <div className="min-h-screen bg-hol-dark text-white font-sans selection:bg-hol-gold selection:text-hol-red overflow-x-hidden pb-12">
      <Snowfall />

      <button 
        onClick={toggleFullScreen}
        className="fixed top-4 right-4 z-50 p-2 bg-hol-dark border border-hol-gold text-hol-gold rounded-full hover:bg-hol-gold hover:text-hol-dark transition-all shadow-lg"
        title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
      >
        {isFullScreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
      </button>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen">
        
        {gameState !== GameState.GAME_OVER && (
          <header className="text-center mb-12 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-red-900/20 blur-3xl rounded-full -z-10"></div>
             
             {/* Replaced Text Headline with Image - Corrected path casing */}
             <div className="flex justify-center items-center mb-4">
               <img 
                 src="holidayJeopardy.png" 
                 alt="Holiday Jeopardy" 
                 className="max-w-[90%] md:max-w-2xl h-auto object-contain drop-shadow-2xl"
               />
             </div>

             {gameState === GameState.PLAYING && (
               <p className="text-gray-300 mt-2 font-montserrat font-semibold text-lg uppercase tracking-[0.3em] opacity-80">Select a clue to begin</p>
             )}
          </header>
        )}

        {error && gameState === GameState.PLAYING && (
          <div className="mb-6 mx-auto max-w-2xl bg-red-900/40 border border-red-500/50 p-3 rounded-lg flex items-center gap-3 text-red-100 text-sm animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <p>{error}</p>
          </div>
        )}

        {gameState === GameState.SETUP && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500">
            <div className="bg-hol-red/10 border border-hol-gold/30 p-8 rounded-2xl backdrop-blur-sm max-w-lg w-full shadow-2xl">
              <div className="flex justify-center mb-6">
                <Gift className="w-16 h-16 text-hol-red" />
              </div>
              <h2 className="text-3xl font-slab font-bold text-center mb-6">Start New Game</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-hol-gold uppercase tracking-wider font-montserrat">Game Topic</label>
                <input 
                  type="text" 
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full bg-black/40 border border-hol-gold/50 rounded-lg p-3 text-white focus:outline-none focus:border-hol-gold focus:ring-1 focus:ring-hol-gold transition-all font-montserrat"
                  placeholder="e.g. Christmas Movies, Holiday Food..."
                />
              </div>

              <div className="mb-8">
                 <div className="mb-2">
                    <label className="block text-sm font-bold text-hol-gold uppercase tracking-wider font-montserrat">Teams</label>
                 </div>
                 <div className="space-y-3 mb-4">
                    {teams.map((team, idx) => (
                       <div key={team.id} className="flex gap-2 animate-in slide-in-from-left-2 duration-300">
                         <input
                          type="text"
                          value={team.name}
                          onChange={(e) => {
                            const newTeams = [...teams];
                            newTeams[idx].name = e.target.value;
                            setTeams(newTeams);
                          }}
                          className="flex-1 bg-black/40 border border-gray-600 rounded-lg p-2 text-sm focus:border-hol-gold focus:outline-none text-white font-montserrat"
                          placeholder="Team Name"
                         />
                         {teams.length > 1 && (
                             <button 
                                onClick={() => removeTeam(team.id)}
                                className="p-2 text-red-400 hover:text-red-200 hover:bg-red-900/30 rounded-lg transition-colors"
                                title="Remove Team"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                         )}
                       </div>
                    ))}
                 </div>
                 <button 
                    onClick={addTeam}
                    disabled={teams.length >= 5}
                    className="w-full text-xs flex items-center justify-center gap-2 bg-hol-green/10 hover:bg-hol-green/20 text-hol-green border border-hol-green/30 px-3 py-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed group font-montserrat uppercase font-semibold"
                 >
                    <Plus className="w-3 h-3 group-hover:scale-125 transition-transform" /> Add Another Team
                 </button>
              </div>

              <button 
                onClick={startGame}
                className="w-full bg-gradient-to-r from-hol-red to-red-600 hover:from-red-600 hover:to-hol-red text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group font-montserrat uppercase tracking-widest"
              >
                <Play className="w-5 h-5 fill-current" />
                Build Game Board
              </button>
            </div>
          </div>
        )}

        {gameState === GameState.LOADING && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-hol-gold animate-spin mb-4" />
            <h2 className="text-2xl font-slab font-bold animate-pulse uppercase tracking-wider">Asking Santa's Elves...</h2>
            <p className="text-gray-400 mt-2 text-center italic font-montserrat">Crafting questions about "{customTopic}"</p>
          </div>
        )}

        {gameState === GameState.PLAYING && gameData && (
          <div className="flex-1 flex flex-col animate-in fade-in duration-700">
            <GameBoard 
              data={gameData} 
              onQuestionClick={handleQuestionClick}
            />
            {checkAllQuestionsAnswered() && (
               <div className="my-10 flex justify-center animate-in bounce-in duration-1000">
                  <button 
                     onClick={() => setGameState(GameState.FINAL_JEOPARDY)}
                     className="bg-gradient-to-r from-hol-gold to-yellow-600 hover:from-yellow-400 hover:to-yellow-700 text-hol-dark font-bold text-2xl py-5 px-12 rounded-full shadow-2xl transform hover:scale-105 transition-all flex items-center gap-4 border-4 border-white/30 font-montserrat uppercase tracking-widest"
                  >
                     Go to Final Jeopardy <ArrowRight className="w-8 h-8" />
                  </button>
               </div>
            )}
            <div className="mt-auto pt-8">
              <ScoreBoard teams={teams} onUpdateScore={handleUpdateScore} />
            </div>
          </div>
        )}

        {gameState === GameState.FINAL_JEOPARDY && gameData && (
           <FinalJeopardy 
              data={gameData.finalJeopardy}
              teams={teams}
              onUpdateScore={handleUpdateScore}
              onEndGame={() => setGameState(GameState.GAME_OVER)}
           />
        )}

        {gameState === GameState.GAME_OVER && (
           <GameOver teams={teams} onRestart={resetGame} />
        )}

        {activeQuestion && (
          <ActiveClue 
            question={activeQuestion}
            teams={teams}
            onClose={handleCloseModal}
            onAwardPoints={handleUpdateScore}
          />
        )}
      </div>
    </div>
  );
};

export default App;