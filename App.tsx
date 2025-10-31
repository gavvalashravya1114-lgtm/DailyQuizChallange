import React, { useState, useEffect, useCallback } from 'react';
import { GameState, QuizQuestion, HistoryEntry } from './types';
import { generateDailyQuiz } from './services/geminiService';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryScreen from './components/HistoryScreen';

const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('home');
    const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        // Load history from local storage on mount
        try {
            const storedHistory = localStorage.getItem('quizHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to parse history from localStorage", e);
        }

        // Check if there's a completed quiz for today
        const todayStr = getTodayDateString();
        const todaysHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]').find((h: HistoryEntry) => h.date === todayStr);

        if (todaysHistory) {
            setScore(todaysHistory.score);
            // Also need to load today's quiz to show the total
            const storedQuizData = localStorage.getItem('dailyQuiz');
            if(storedQuizData) {
                const { date, questions } = JSON.parse(storedQuizData);
                if(date === todayStr) {
                    setQuiz(questions);
                }
            }
            setGameState('results');
        }
    }, []);

    useEffect(() => {
        if (gameState === 'playing' && quiz && currentQuestionIndex >= quiz.length) {
            const todayStr = getTodayDateString();
            const newHistoryEntry: HistoryEntry = { date: todayStr, score: score, total: quiz.length };
            
            const updatedHistory = [
                ...history.filter(h => h.date !== todayStr),
                newHistoryEntry
            ];
            setHistory(updatedHistory);
            localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));

            setGameState('results');
        }
    }, [currentQuestionIndex, gameState, quiz, score, history]);


    const handleStartQuiz = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const todayStr = getTodayDateString();
            const storedQuizData = localStorage.getItem('dailyQuiz');
            let dailyQuiz;

            if (storedQuizData) {
                const { date, questions } = JSON.parse(storedQuizData);
                if (date === todayStr) {
                    dailyQuiz = questions;
                }
            }
            
            if (!dailyQuiz) {
                const newQuizData = await generateDailyQuiz();
                dailyQuiz = newQuizData.quiz;
                localStorage.setItem('dailyQuiz', JSON.stringify({ date: todayStr, questions: dailyQuiz }));
            }
            
            setQuiz(dailyQuiz);
            setCurrentQuestionIndex(0);
            setScore(0);
            setGameState('playing');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prev => prev + 1);
    };
    
    const renderContent = () => {
        switch (gameState) {
            case 'playing':
                if (!quiz || currentQuestionIndex >= quiz.length) {
                    return null; // Or a loading spinner
                }
                return <QuizScreen 
                            quiz={quiz} 
                            currentQuestionIndex={currentQuestionIndex} 
                            onAnswer={handleAnswer}
                            onNextQuestion={handleNextQuestion}
                        />;
            case 'results':
                return <ResultsScreen score={score} total={quiz?.length || 10} onShowHistory={() => setGameState('history')} onGoHome={() => setGameState('home')} />;
            case 'history':
                return <HistoryScreen history={history} onGoHome={() => setGameState('home')} />;
            case 'home':
            default:
                return (
                    <>
                        <HomeScreen onStart={handleStartQuiz} loading={loading} history={history} onShowHistory={() => setGameState('history')} />
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    </>
                );
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md h-[90vh] max-h-[700px] bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
                {renderContent()}
            </div>
        </main>
    );
};

export default App;