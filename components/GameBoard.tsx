import React from 'react';
import { GameData, Question } from '../types';

interface GameBoardProps {
  data: GameData;
  onQuestionClick: (question: Question) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ data, onQuestionClick }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 perspective-1000" lang="en">
      <div className="grid grid-cols-5 gap-2 md:gap-4">
        
        {/* Category Headers */}
        {data.categories.map((category) => (
          <div 
            key={category.id} 
            className="aspect-[4/3] bg-hol-dark border-2 border-hol-gold rounded-lg shadow-lg flex items-center justify-center p-1 md:p-3 text-center transform hover:-translate-y-1 transition-transform duration-300 overflow-hidden"
          >
            <h3 className="text-white font-geopardy text-[10px] sm:text-xs md:text-sm lg:text-lg uppercase tracking-widest drop-shadow-md leading-tight hyphenate max-h-full">
              {category.title}
            </h3>
          </div>
        ))}

        {/* Questions Grid */}
        {Array.from({ length: 5 }).map((_, rowIndex) => (
           <React.Fragment key={`row-${rowIndex}`}>
             {data.categories.map((category) => {
               const question = category.questions[rowIndex];
               return (
                 <button
                   key={question.id}
                   onClick={() => !question.isAnswered && onQuestionClick(question)}
                   disabled={question.isAnswered}
                   className={`
                     aspect-[4/3] rounded-lg border-2 flex items-center justify-center shadow-lg transition-all duration-500
                     ${question.isAnswered 
                        ? 'bg-hol-dark/50 border-gray-700 opacity-50 cursor-default' 
                        : 'bg-hol-red border-hol-gold hover:bg-red-600 hover:scale-105 hover:z-10 cursor-pointer'}
                   `}
                 >
                   {question.isAnswered ? (
                     <span className="text-2xl md:text-4xl text-gray-600 font-christmas">❄</span>
                   ) : (
                     <span className="text-hol-gold font-montserrat font-semibold text-xl md:text-4xl drop-shadow-sm">
                       ${question.value}
                     </span>
                   )}
                 </button>
               );
             })}
           </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;