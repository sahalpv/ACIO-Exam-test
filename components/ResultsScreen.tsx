
import React from 'react';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getFeedback = () => {
    if (percentage >= 80) return "Excellent! You're well-prepared.";
    if (percentage >= 60) return "Good job! Keep practicing to improve.";
    if (percentage >= 40) return "Solid effort. Focus on weaker areas.";
    return "Keep studying! Every attempt is a step forward.";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-indigo-400 mb-4">Quiz Complete!</h2>
        <p className="text-lg text-gray-300 mb-6">You've finished the quiz.</p>
        <div className="mb-6">
          <p className="text-xl text-gray-200">Your Score:</p>
          <p className="text-6xl font-bold my-2">{score} / {totalQuestions}</p>
          <p className="text-2xl text-indigo-300">{percentage}%</p>
        </div>
        <p className="text-gray-400 mb-8 italic">{getFeedback()}</p>
        <button
          onClick={onRestart}
          className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors duration-300"
        >
          Take Another Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
