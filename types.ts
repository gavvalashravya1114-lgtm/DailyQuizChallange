export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export interface QuizData {
  quiz: QuizQuestion[];
}

export interface HistoryEntry {
  date: string;
  score: number;
  total: number;
}

export type GameState = 'home' | 'playing' | 'results' | 'history';