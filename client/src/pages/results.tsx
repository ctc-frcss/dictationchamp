import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Download, Play, Home } from "lucide-react";
import { useGameState } from "@/hooks/use-game-state";
import { exportToCsv } from "@/lib/csv-export";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Results() {
  const [, setLocation] = useLocation();
  const { results, score, resetGame } = useGameState();

  const saveResultsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/game-sessions", data);
      return response.json();
    },
  });

  useEffect(() => {
    if (results.length === 0) {
      setLocation("/");
      return;
    }

    // Save results to backend
    const sessionData = {
      wordBank: results.map(r => r.word),
      results: results,
      totalScore: score,
      totalQuestions: results.length,
      completedAt: new Date().toISOString(),
    };

    saveResultsMutation.mutate(sessionData);
  }, [results, score]);

  if (results.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-2xl">No results found. Redirecting...</div>
      </div>
    );
  }

  const correctCount = results.filter(r => r.correct).length;
  const incorrectCount = results.length - correctCount;
  const percentage = Math.round((correctCount / results.length) * 100);

  const downloadResults = () => {
    exportToCsv(results, `dictation-champ-results-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const playAgain = () => {
    resetGame();
    setLocation("/word-bank");
  };

  const getAchievementBadges = (percentage: number) => {
    const badges = [];
    if (percentage === 100) badges.push({ emoji: '🏆', title: 'Perfect Score!', desc: 'You got every word right!' });
    if (percentage >= 80) badges.push({ emoji: '⭐', title: 'Star Student!', desc: 'Excellent spelling skills!' });
    if (percentage >= 60) badges.push({ emoji: '👍', title: 'Great Job!', desc: 'You\'re doing really well!' });
    
    const noHintsUsed = results.every(r => !r.hintsUsed);
    if (noHintsUsed) badges.push({ emoji: '🧠', title: 'Brain Power!', desc: 'No hints needed!' });
    
    if (badges.length === 0) {
      badges.push({ emoji: '💪', title: 'Keep Trying!', desc: 'Practice makes perfect!' });
    }
    
    return badges;
  };

  const badges = getAchievementBadges(percentage);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-2xl">
          <CardContent className="p-8 text-center">
            {/* Celebration Header */}
            <motion.div 
              className="mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-5xl font-fredoka text-primary-custom mb-4">Awesome Job!</h2>
              <p className="text-xl text-gray-600">You've completed your spelling adventure!</p>
            </motion.div>

            {/* Score Display */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-green-100 to-green-200 border-0">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-2">✅</div>
                    <div className="text-3xl font-fredoka text-success-custom">{correctCount}</div>
                    <div className="text-gray-600">Correct</div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-red-100 to-red-200 border-0">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-2">❌</div>
                    <div className="text-3xl font-fredoka text-primary-custom">{incorrectCount}</div>
                    <div className="text-gray-600">Incorrect</div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-0">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-3xl font-fredoka text-accent-custom">{percentage}%</div>
                    <div className="text-gray-600">Accuracy</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Achievement Badges */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="flex flex-wrap justify-center gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.2, type: "spring" }}
                  >
                    <Card className="bg-gradient-to-br from-accent-custom/20 to-yellow-100 border-0">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">{badge.emoji}</div>
                        <div className="font-fredoka text-lg text-gray-700">{badge.title}</div>
                        <div className="text-sm text-gray-600">{badge.desc}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <Button
                onClick={downloadResults}
                className="bg-secondary-custom hover:bg-teal-500 text-white font-semibold"
              >
                <Download className="mr-2 w-4 h-4" />
                Download Results
              </Button>
              <Button
                onClick={playAgain}
                className="bg-gradient-to-r from-primary-custom to-pink-custom text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                <Play className="mr-2 w-4 h-4" />
                Play Again!
              </Button>
              <Button
                onClick={() => setLocation("/")}
                className="bg-purple-custom hover:bg-purple-600 text-white font-semibold"
              >
                <Home className="mr-2 w-4 h-4" />
                Home
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
