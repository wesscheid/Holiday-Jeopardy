import React from 'react';
import { GameData, Question } from '../types';

interface GameBoardProps {
  data: GameData;
  onQuestionClick: (question: Question) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ data, onQuestionClick }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 perspective-1000">
      <div className="grid grid-cols-5 gap-2 md:gap-4">
        
        {/* Category Headers */}
        {data.categories.map((category) => (
          <div 
            key={category.id} 
            className="aspect-[4/3] bg-hol-dark border-2 border-hol-gold rounded-lg shadow-lg flex items-center justify-center p-2 text-center transform hover:-translate-y-1 transition-transform duration-300"
          >
            <h3 className="text-white font-slab font-bold text-sm md:text-xl lg:text-2xl uppercase tracking-wide drop-shadow-md">
              {category.title}
            </h3>
          </div>
        ))}

        {/* Questions Grid */}
        {/* We need to map row by row for visual consistency if we did raw loops, but CSS Grid handles column flow naturally if we just dump them? 
            No, structure is Categories -> Questions.
            We need to transpose the data to render row by row for standard HTML flow, 
            OR use CSS Grid with grid-auto-flow: column? 
            Let's do standard column mapping but ensure the parent is display grid.
        */}
        
        {/* 
           Actually, rendering columns is easier with flex/grid columns, but for a semantic table feel, rows are often better. 
           However, let's stick to the visual grid. 
           We have 5 columns. Each column contains 5 cards. 
           But to align rows, we must be careful.
           Let's create an array of rows [0..4] and inside map categories.
        */}
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
                     <span className="text-4xl text-gray-600 font-christmas">❄</span>
                   ) : (
                     <span className="text-hol-gold font-slab font-bold text-2xl md:text-4xl drop-shadow-sm">
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