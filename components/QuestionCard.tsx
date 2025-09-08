
import React, { useState, useEffect } from 'react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  onNext: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber, totalQuestions, onAnswer, onNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [question]);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    
    const isCorrect = option === question.correctAnswer;
    setSelectedAnswer(option);
    setIsAnswered(true);
    onAnswer(option, isCorrect);
  };

  const getOptionClasses = (option: string) => {
    if (!isAnswered) {
      return 'border-gray-600 bg-gray-700 hover:bg-gray-600 hover:border-indigo-500';
    }
    if (option === question.correctAnswer) {
      return 'bg-green-500/30 border-green-500 text-white';
    }
    if (option === selectedAnswer) {
      return 'bg-red-500/30 border-red-500 text-white';
    }
    return 'border-gray-600 bg-gray-700 opacity-60';
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl text-white animate-fade-in">
      <div className="mb-6">
        <p className="text-indigo-400 font-semibold mb-2">Question {questionNumber} of {totalQuestions}</p>
        <h2 className="text-2xl font-bold leading-tight text-gray-100">{question.question}</h2>
      </div>
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${getOptionClasses(option)}`}
          >
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className="mt-6 p-4 rounded-lg bg-gray-900/50 animate-fade-in">
            <p className="font-bold text-lg mb-2">Explanation:</p>
            <p className="text-gray-300">{question.explanation}</p>
        </div>
      )}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isAnswered}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {questionNumber === totalQuestions ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
