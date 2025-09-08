
export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export enum QuizState {
  LOADING,
  READY,
  ERROR,
  COMPLETED,
}
