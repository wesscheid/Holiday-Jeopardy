import React, { useState, useEffect } from 'react';
import { GameState, GameData, Question, Team } from './types';
import { generateGameData } from './services/geminiService';
import GameBoard from './components/GameBoard';
import ActiveClue from './components/ActiveClue';
import ScoreBoard from './components/ScoreBoard';
import FinalJeopardy from './components/FinalJeopardy';
import GameOver from './components/GameOver';
import Snowfall from './components/Snowfall';
import { Snowflake, Gift, Loader2, Play, Plus, Trash2, ArrowRight, Maximize, Minimize } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [customTopic, setCustomTopic] = useState("Christmas Traditions");
  const [isFullScreen, setIsFullScreen] = useState(false);
  
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
    setGameState(GameState.LOADING);
    const data = await generateGameData(customTopic);
    setGameData(data);
    setGameState(GameState.PLAYING);
  };

  const handleQuestionClick = (question: Question) => {
    setActiveQuestion(question);
  };

  const handleCloseModal = () => {
    if (activeQuestion && gameData) {
      // Mark as answered locally
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

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen">
        
        {/* Header - Only show in Setup, Loading, and Playing */}
        {gameState !== GameState.GAME_OVER && (
          <header className="text-center mb-8 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-red-900/20 blur-3xl rounded-full -z-10"></div>
             <h1 className="font-christmas text-6xl md:text-7xl text-hol-gold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
               Holiday Jeopardy
             </h1>
             {gameState === GameState.PLAYING && (
               <p className="text-gray-300 mt-2 font-slab text-lg">Select a clue to begin</p>
             )}
          </header>
        )}

        {/* SETUP PHASE */}
        {gameState === GameState.SETUP && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500">
            <div className="bg-hol-red/10 border border-hol-gold/30 p-8 rounded-2xl backdrop-blur-sm max-w-lg w-full shadow-2xl">
              <div className="flex justify-center mb-6">
                <Gift className="w-16 h-16 text-hol-red" />
              </div>
              <h2 className="text-3xl font-slab font-bold text-center mb-6">Start New Game</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-hol-gold uppercase tracking-wider">Game Topic</label>
                <input 
                  type="text" 
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full bg-black/40 border border-hol-gold/50 rounded-lg p-3 text-white focus:outline-none focus:border-hol-gold focus:ring-1 focus:ring-hol-gold transition-all"
                  placeholder="e.g. Christmas Movies, Holiday Food..."
                />
              </div>

              <div className="mb-8">
                 <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-hol-gold uppercase tracking-wider">Teams</label>
                    <button 
                        onClick={addTeam}
                        disabled={teams.length >= 5}
                        className="text-xs flex items-center gap-1 bg-hol-green/20 hover:bg-hol-green text-hol-green hover:text-white border border-hol-green px-3 py-1 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-3 h-3" /> Add Team
                    </button>
                 </div>
                 <div className="space-y-3">
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
                          className="flex-1 bg-black/40 border border-gray-600 rounded-lg p-2 text-sm focus:border-hol-gold focus:outline-none text-white"
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
              </div>

              <button 
                onClick={startGame}
                className="w-full bg-gradient-to-r from-hol-red to-red-600 hover:from-red-600 hover:to-hol-red text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
              >
                <Play className="w-5 h-5 fill-current" />
                Build Game Board
              </button>
            </div>
          </div>
        )}

        {/* LOADING PHASE */}
        {gameState === GameState.LOADING && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-hol-gold animate-spin mb-4" />
            <h2 className="text-2xl font-slab font-bold animate-pulse">Asking Santa's Elves (Gemini)...</h2>
            <p className="text-gray-400 mt-2">Generating categories and clues</p>
          </div>
        )}

        {/* PLAYING PHASE */}
        {gameState === GameState.PLAYING && gameData && (
          <div className="flex-1 flex flex-col animate-in fade-in duration-700">
            
            <GameBoard 
              data={gameData} 
              onQuestionClick={handleQuestionClick}
            />

            {/* Final Jeopardy Trigger */}
            {checkAllQuestionsAnswered() && (
               <div className="my-6 flex justify-center animate-in bounce-in duration-1000">
                  <button 
                     onClick={() => setGameState(GameState.FINAL_JEOPARDY)}
                     className="bg-gradient-to-r from-hol-gold to-yellow-600 hover:from-yellow-400 hover:to-yellow-700 text-hol-dark font-bold text-2xl py-4 px-10 rounded-full shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3 border-4 border-white/20"
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

        {/* FINAL JEOPARDY */}
        {gameState === GameState.FINAL_JEOPARDY && gameData && (
           <FinalJeopardy 
              data={gameData.finalJeopardy}
              teams={teams}
              onUpdateScore={handleUpdateScore}
              onEndGame={() => setGameState(GameState.GAME_OVER)}
           />
        )}

        {/* GAME OVER */}
        {gameState === GameState.GAME_OVER && (
           <GameOver teams={teams} onRestart={resetGame} />
        )}

        {/* MODAL */}
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