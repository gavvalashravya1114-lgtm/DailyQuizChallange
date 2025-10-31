import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import ProgressBar from './ProgressBar';

interface QuizScreenProps {
  quiz: QuizQuestion[];
  currentQuestionIndex: number;
  onAnswer: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ quiz, currentQuestionIndex, onAnswer, onNextQuestion }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = quiz[currentQuestionIndex];
  const round = Math.floor(currentQuestionIndex / 5) + 1;

  useEffect(() => {
    // Reset state when question changes
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  const handleAnswerClick = (option: string) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    onAnswer(isCorrect);
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-slate-700 hover:bg-slate-600';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'bg-green-600';
    }
    if (option === selectedAnswer) {
      return 'bg-red-600';
    }
    return 'bg-slate-700 opacity-50';
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="flex justify-between items-center">
          <p className="text-indigo-400 font-semibold">Question {currentQuestionIndex + 1} of {quiz.length}</p>
          <p className="text-slate-400 font-semibold">Round {round}</p>
        </div>
        <ProgressBar current={currentQuestionIndex + 1} total={quiz.length} />
        <h2 className="text-2xl md:text-3xl font-bold mt-6 leading-tight" dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></h2>
        
        <div className="mt-8 space-y-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerClick(option)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg text-lg transition-all duration-300 disabled:cursor-not-allowed ${getButtonClass(option)}`}
            >
              {option}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="mt-6 p-4 bg-slate-900 rounded-lg">
            <h3 className="font-bold text-lg text-indigo-400 mb-2">Explanation</h3>
            <p className="text-slate-300">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {isAnswered && (
          <div className="mt-4 flex-shrink-0">
              <button 
                  onClick={onNextQuestion}
                  className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
              >
                  {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
          </div>
      )}
    </div>
  );
};

export default QuizScreen;