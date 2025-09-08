
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SplashScreenProps {
  message: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white p-4">
      <h1 className="text-4xl font-bold mb-2 text-indigo-400">ACIO Exam Prep</h1>
      <p className="text-lg text-gray-300 mb-8">Your AI-powered study partner</p>
      <LoadingSpinner />
      <p className="mt-4 text-gray-400 animate-pulse">{message}</p>
    </div>
  );
};

export default SplashScreen;
