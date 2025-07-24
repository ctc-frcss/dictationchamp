import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Volume2, Lightbulb, Check, RotateCcw } from "lucide-react";
import { useGameState } from "@/hooks/use-game-state";
import { useSpeech } from "@/hooks/use-speech";
import { DragDropLetter } from "@/components/ui/drag-drop-letter";
import { Confetti } from "@/components/ui/confetti";

export default function Game() {
  const [, setLocation] = useLocation();
  const { 
    wordBank, 
    currentWordIndex, 
    gameWords, 
    score, 
    currentWord, 
    userAnswer, 
    hintsUsed,
    initializeGame,
    loadNextWord,
    setUserAnswer,
    submitAnswer,
    clearAnswer,
    showHint,
    hintText,
    isHintVisible
  } = useGameState();
  
  const { speak } = useSpeech();
  const [showCelebration, setShowCelebration] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);

  useEffect(() => {
    if (wordBank.length === 0) {
      setLocation("/word-bank");
      return;
    }
    
    if (gameWords.length === 0) {
      initializeGame();
    }
  }, [wordBank, gameWords, initializeGame, setLocation]);

  useEffect(() => {
    if (currentWord && gameWords.length > 0) {
      // Auto-play word after a short delay
      const timer = setTimeout(() => {
        speak(currentWord);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentWord, speak, currentWordIndex]);

  const handleSubmit = async () => {
    const result = submitAnswer();
    
    if (result.correct) {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        if (currentWordIndex >= 9) {
          setLocation("/results");
        } else {
          loadNextWord();
        }
      }, 2000);
    } else {
      setShowIncorrect(true);
    }
  };

  const handleIncorrectNext = () => {
    setShowIncorrect(false);
    if (currentWordIndex >= 9) {
      setLocation("/results");
    } else {
      loadNextWord();
    }
  };

  if (gameWords.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-2xl">Loading game...</div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        {/* Game Header */}
        <Card className="shadow-xl mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <Button
                  onClick={() => setLocation("/word-bank")}
                  variant="secondary"
                  className="mr-4"
                >
                  <Home className="w-4 h-4" />
                </Button>
                <h2 className="text-2xl font-fredoka text-primary-custom">Dictation Champ</h2>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-fredoka text-secondary-custom">
                    {currentWordIndex + 1}/10
                  </div>
                  <div className="text-sm text-gray-600">Question</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-fredoka text-success-custom">{score}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Area */}
        <Card className="shadow-2xl">
          <CardContent className="p-8 text-center">
            {/* Word Audio Section */}
            <div className="mb-8">
              <h3 className="text-3xl font-fredoka text-gray-700 mb-6">
                🎧 Listen and Spell the Word!
              </h3>
              <Button
                onClick={() => speak(currentWord)}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xl font-fredoka py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                <Volume2 className="mr-3 w-6 h-6" />
                Play Word
              </Button>
              <p className="text-gray-500 mt-2">Click to hear the word again!</p>
            </div>

            {/* Word Display Area */}
            <DragDropLetter 
              word={currentWord}
              userAnswer={userAnswer}
              onAnswerChange={setUserAnswer}
            />

            {/* Hint Section */}
            <AnimatePresence>
              {isHintVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8"
                >
                  <div className="bg-accent-custom/20 rounded-2xl p-4">
                    <h4 className="font-fredoka text-lg text-gray-700 mb-2 flex items-center justify-center">
                      <Lightbulb className="mr-2 w-5 h-5" />
                      Hint:
                    </h4>
                    <p className="text-gray-600">{hintText}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button
                onClick={showHint}
                disabled={isHintVisible || hintsUsed > 0}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
              >
                <Lightbulb className="mr-2 w-4 h-4" />
                Get Hint
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                <Check className="mr-2 w-4 h-4" />
                Submit Answer
              </Button>
              <Button
                onClick={clearAnswer}
                variant="secondary"
                className="font-semibold"
              >
                <RotateCcw className="mr-2 w-4 h-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showCelebration && (
          <>
            <Confetti />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="bg-white rounded-3xl p-8 text-center"
              >
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-3xl font-fredoka text-success-custom mb-2">Correct!</h3>
                <p className="text-gray-600">Great job spelling "{currentWord.toUpperCase()}"!</p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Incorrect Modal */}
      <AnimatePresence>
        {showIncorrect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-white rounded-3xl p-8 text-center"
            >
              <div className="text-6xl mb-4">💪</div>
              <h3 className="text-3xl font-fredoka text-primary-custom mb-2">Try Again!</h3>
              <p className="text-gray-600 mb-4">
                The correct spelling is "{currentWord.toUpperCase()}"
              </p>
              <Button
                onClick={handleIncorrectNext}
                className="bg-primary-custom hover:bg-red-500 text-white font-semibold"
              >
                Next Word
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
