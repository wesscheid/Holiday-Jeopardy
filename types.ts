export interface Question {
  id: string;
  value: number;
  clue: string;
  answer: string;
  isAnswered: boolean;
}

export interface Category {
  id: string;
  title: string;
  questions: Question[];
}

export interface FinalJeopardyQuestion {
  category: string;
  clue: string;
  answer: string;
}

export interface GameData {
  categories: Category[];
  finalJeopardy: FinalJeopardyQuestion;
}

export interface Team {
  id: number;
  name: string;
  score: number;
}

export enum GameState {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  FINAL_JEOPARDY = 'FINAL_JEOPARDY',
  GAME_OVER = 'GAME_OVER',
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}