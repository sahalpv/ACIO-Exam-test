
import React, { useState, useEffect, useCallback } from 'react';
import { generateQuizQuestions } from './services/geminiService';
import type { Question } from './types';
import { QuizState } from './types';
import SplashScreen from './components/SplashScreen';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>(QuizState.LOADING);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setQuizState(QuizState.LOADING);
    setError(null);
    try {
      const fetchedQuestions = await generateQuizQuestions();
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
        setQuizState(QuizState.READY);
      } else {
        setError("No questions were generated. Please try again.");
        setQuizState(QuizState.ERROR);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setQuizState(QuizState.ERROR);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuestions([]);
    fetchQuestions();
  };

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizState(QuizState.COMPLETED);
    }
  };

  const renderContent = () => {
    switch (quizState) {
      case QuizState.LOADING:
        return <SplashScreen message="Generating your personalized quiz..." />;
      case QuizState.ERROR:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center text-white p-4">
            <h2 className="text-2xl text-red-400 mb-4">An Error Occurred</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={resetQuiz}
              className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      case QuizState.READY:
        return (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
          />
        );
      case QuizState.COMPLETED:
        return (
          <ResultsScreen
            score={score}
            totalQuestions={questions.length}
            onRestart={resetQuiz}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-3xl">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
