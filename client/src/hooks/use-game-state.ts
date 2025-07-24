import { create } from "zustand";
import { GameResult } from "@shared/schema";

interface GameState {
  wordBank: string[];
  gameWords: string[];
  currentWordIndex: number;
  currentWord: string;
  userAnswer: string;
  score: number;
  results: GameResult[];
  hintsUsed: number;
  hintText: string;
  isHintVisible: boolean;

  // Actions
  setWordBank: (words: string[]) => void;
  initializeGame: () => void;
  loadNextWord: () => void;
  setUserAnswer: (answer: string) => void;
  submitAnswer: () => { correct: boolean };
  clearAnswer: () => void;
  showHint: () => void;
  resetGame: () => void;
}

export const useGameState = create<GameState>((set, get) => ({
  wordBank: [],
  gameWords: [],
  currentWordIndex: 0,
  currentWord: '',
  userAnswer: '',
  score: 0,
  results: [],
  hintsUsed: 0,
  hintText: '',
  isHintVisible: false,

  setWordBank: (words) => set({ wordBank: words }),

  initializeGame: () => {
    const { wordBank } = get();
    
    // Select 10 random words (allow repeats if less than 10)
    const gameWords = [];
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * wordBank.length);
      gameWords.push(wordBank[randomIndex]);
    }

    set({
      gameWords,
      currentWordIndex: 0,
      currentWord: gameWords[0],
      userAnswer: '',
      score: 0,
      results: [],
      hintsUsed: 0,
      hintText: '',
      isHintVisible: false,
    });
  },

  loadNextWord: () => {
    const { gameWords, currentWordIndex } = get();
    const nextIndex = currentWordIndex + 1;
    
    if (nextIndex < gameWords.length) {
      set({
        currentWordIndex: nextIndex,
        currentWord: gameWords[nextIndex],
        userAnswer: '',
        hintsUsed: 0,
        hintText: '',
        isHintVisible: false,
      });
    }
  },

  setUserAnswer: (answer) => set({ userAnswer: answer }),

  submitAnswer: () => {
    const { currentWord, userAnswer, results, score } = get();
    const cleanAnswer = userAnswer.replace(/_/g, '').toLowerCase();
    const isCorrect = cleanAnswer === currentWord.toLowerCase();

    const result: GameResult = {
      word: currentWord,
      userAnswer: cleanAnswer,
      correct: isCorrect,
      hintsUsed: get().hintsUsed > 0,
    };

    set({
      results: [...results, result],
      score: isCorrect ? score + 1 : score,
    });

    return { correct: isCorrect };
  },

  clearAnswer: () => set({ userAnswer: '' }),

  showHint: () => {
    const { currentWord, hintsUsed } = get();
    
    if (hintsUsed > 0) return;

    const firstLetter = currentWord[0].toUpperCase();
    set({
      hintText: `The word starts with the letter "${firstLetter}"`,
      isHintVisible: true,
      hintsUsed: hintsUsed + 1,
    });
  },

  resetGame: () => set({
    wordBank: [],
    gameWords: [],
    currentWordIndex: 0,
    currentWord: '',
    userAnswer: '',
    score: 0,
    results: [],
    hintsUsed: 0,
    hintText: '',
    isHintVisible: false,
  }),
}));
