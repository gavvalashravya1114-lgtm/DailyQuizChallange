
import React from 'react';

interface ResultsScreenProps {
  score: number;
  total: number;
  onShowHistory: () => void;
  onGoHome: () => void;
}

const getFeedback = (score: number, total: number): { emoji: string, message: string } => {
  const percentage = (score / total) * 100;
  if (percentage === 100) return { emoji: '🏆', message: 'Perfect Score! You\'re a genius!' };
  if (percentage >= 80) return { emoji: '🎉', message: 'Excellent Job! You really know your stuff.' };
  if (percentage >= 60) return { emoji: '👍', message: 'Great effort! A solid score.' };
  if (percentage >= 40) return { emoji: '🤔', message: 'Not bad! Keep learning.' };
  return { emoji: '🧠', message: 'Good try! Come back tomorrow to improve.' };
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, total, onShowHistory, onGoHome }) => {
  const { emoji, message } = getFeedback(score, total);
  
  const handleShare = () => {
    const shareText = `I scored ${score}/${total} on today's Daily Quiz! Can you beat my score?`;
    if (navigator.share) {
      navigator.share({
        title: 'Daily Quiz Challenge',
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Score copied to clipboard!');
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <span className="text-7xl mb-4">{emoji}</span>
      <h2 className="text-3xl font-bold">Quiz Complete!</h2>
      <p className="text-slate-300 mt-2 text-lg">{message}</p>
      
      <div className="my-8">
        <p className="text-slate-400">Your Score</p>
        <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">{score}<span className="text-4xl text-slate-400">/{total}</span></p>
      </div>
      
      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={handleShare}
          className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
        >
          Share Score
        </button>
        <button
          onClick={onShowHistory}
          className="w-full bg-slate-700 text-slate-200 font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors"
        >
          View Past Performance
        </button>
        <button
          onClick={onGoHome}
          className="w-full text-indigo-400 font-semibold py-2"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
