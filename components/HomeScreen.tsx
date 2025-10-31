
import React from 'react';
import { HistoryEntry } from '../types';

interface HomeScreenProps {
  onStart: () => void;
  onShowHistory: () => void;
  loading: boolean;
  history: HistoryEntry[];
}

const BrainIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C9.24 2 7 4.24 7 7c0 1.65.8 3.09 2.01 4H9c-1.66 0-3 1.34-3 3v2h12v-2c0-1.66-1.34-3-3-3h-.01c1.21-.91 2.01-2.35 2.01-4 0-2.76-2.24-5-5-5zm0 11c-.83 0-1.5-.67-1.5-1.5S11.17 10 12 10s1.5.67 1.5 1.5S12.83 13 12 13zm-3.5-3.5c-.83 0-1.5-.67-1.5-1.5S7.67 6.5 8.5 6.5s1.5.67 1.5 1.5S9.33 9.5 8.5 9.5zm7 0c-.83 0-1.5-.67-1.5-1.5S14.67 6.5 15.5 6.5s1.5.67 1.5 1.5S16.33 9.5 15.5 9.5z" />
  </svg>
);


const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onShowHistory, loading, history }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <BrainIcon />
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mt-4">
        Daily Quiz Challenge
      </h1>
      <p className="text-slate-300 mt-4 max-w-md">
        Boost your knowledge with a new 5-question quiz every day. Are you ready for today's challenge?
      </p>
      <div className="mt-8 space-y-4 w-full max-w-xs">
        <button
          onClick={onStart}
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
        >
          {loading ? 'Generating Quiz...' : 'Start Today\'s Quiz'}
        </button>
        {history.length > 0 && (
          <button
            onClick={onShowHistory}
            className="w-full bg-slate-700 text-slate-200 font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors"
          >
            View Past Performance
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
