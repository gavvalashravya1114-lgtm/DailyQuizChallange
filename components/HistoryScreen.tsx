
import React from 'react';
import { HistoryEntry } from '../types';

interface HistoryScreenProps {
  history: HistoryEntry[];
  onGoHome: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onGoHome }) => {
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
        Your Performance History
      </h2>
      
      <div className="flex-grow overflow-y-auto pr-2 space-y-3">
        {sortedHistory.length === 0 ? (
          <p className="text-center text-slate-400 mt-8">No history yet. Play your first quiz!</p>
        ) : (
          sortedHistory.map((entry) => (
            <div key={entry.date} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center shadow-md">
              <div>
                <p className="font-semibold text-lg">{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <p className="text-2xl font-bold text-indigo-400">{entry.score}<span className="text-lg text-slate-400">/{entry.total}</span></p>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={onGoHome}
          className="w-full max-w-xs bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default HistoryScreen;
