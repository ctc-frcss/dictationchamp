import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DragDropLetterProps {
  word: string;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
}

export function DragDropLetter({ word, userAnswer, onAnswerChange }: DragDropLetterProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ letter: string; id: string; used: boolean }[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Initialize slots and letters when word changes
  useEffect(() => {
    const newSlots = new Array(word.length).fill("");
    setSlots(newSlots);

    // Create available letters (word letters + some decoys)
    const wordLetters = word.split('');
    const decoyLetters = ['a', 'e', 'i', 'o', 'u', 'r', 's', 't', 'n', 'l'];
    const letters = [...wordLetters];
    
    // Add some decoy letters that aren't in the word
    const numDecoys = Math.min(3, 8 - wordLetters.length);
    for (let i = 0; i < numDecoys; i++) {
      const unusedDecoys = decoyLetters.filter(d => !wordLetters.includes(d));
      if (unusedDecoys.length > 0) {
        const randomDecoy = unusedDecoys[Math.floor(Math.random() * unusedDecoys.length)];
        letters.push(randomDecoy);
      }
    }

    // Shuffle and create letter objects
    const shuffledLetters = letters
      .sort(() => Math.random() - 0.5)
      .map((letter, index) => ({ 
        letter, 
        id: `letter-${index}`, 
        used: false 
      }));

    setAvailableLetters(shuffledLetters);
  }, [word]);

  // Update parent component when user answer changes
  useEffect(() => {
    const answer = slots.join('').toLowerCase();
    onAnswerChange(answer);
  }, [slots, onAnswerChange]);

  const handleDragStart = (e: React.DragEvent, letterId: string) => {
    setDraggedItem(letterId);
    e.dataTransfer.setData('text/plain', letterId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    const letterId = e.dataTransfer.getData('text/plain');
    
    if (!letterId) return;

    const letterObj = availableLetters.find(l => l.id === letterId);
    if (!letterObj || letterObj.used) return;

    // If slot is already filled, return the letter to available pool
    if (slots[slotIndex]) {
      const existingLetter = slots[slotIndex];
      setAvailableLetters(prev => 
        prev.map(l => 
          l.letter.toLowerCase() === existingLetter.toLowerCase() && l.used 
            ? { ...l, used: false } 
            : l
        )
      );
    }

    // Place letter in slot
    const newSlots = [...slots];
    newSlots[slotIndex] = letterObj.letter;
    setSlots(newSlots);

    // Mark letter as used
    setAvailableLetters(prev => 
      prev.map(l => l.id === letterId ? { ...l, used: true } : l)
    );
  };

  const handleSlotClick = (slotIndex: number) => {
    const letter = slots[slotIndex];
    if (letter) {
      // Return letter to available pool
      setAvailableLetters(prev => 
        prev.map(l => 
          l.letter.toLowerCase() === letter.toLowerCase() && l.used 
            ? { ...l, used: false } 
            : l
        )
      );

      // Clear slot
      const newSlots = [...slots];
      newSlots[slotIndex] = '';
      setSlots(newSlots);
    }
  };

  const handleLetterClick = (letterId: string) => {
    const letterObj = availableLetters.find(l => l.id === letterId);
    if (!letterObj || letterObj.used) return;

    // Find first empty slot
    const emptySlotIndex = slots.findIndex(slot => slot === '');
    if (emptySlotIndex === -1) return;

    // Place letter in first empty slot
    const newSlots = [...slots];
    newSlots[emptySlotIndex] = letterObj.letter;
    setSlots(newSlots);

    // Mark letter as used
    setAvailableLetters(prev => 
      prev.map(l => l.id === letterId ? { ...l, used: true } : l)
    );
  };

  const clearAll = () => {
    setSlots(new Array(word.length).fill(""));
    setAvailableLetters(prev => prev.map(l => ({ ...l, used: false })));
  };

  return (
    <div className="mb-8">
      {/* Word Display Area */}
      <div className="mb-6">
        <div className="flex justify-center space-x-2 mb-4">
          {slots.map((letter, index) => (
            <motion.div
              key={index}
              className={`letter-slot bg-gray-100 rounded-xl w-16 h-16 flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300 ${
                letter ? 'bg-blue-100 border-2 border-blue-500 border-solid' : 'border-2 border-dashed border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => handleSlotClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {letter && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-blue-800"
                >
                  {letter.toUpperCase()}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
        <div className="text-sm text-gray-500 mb-2">
          Drag letters from below or click to add/remove
        </div>
        <button
          onClick={clearAll}
          className="text-sm text-blue-500 hover:text-blue-700 underline"
        >
          Clear all letters
        </button>
      </div>

      {/* Available Letters */}
      <div>
        <h4 className="text-xl font-fredoka text-gray-700 mb-4">Available Letters:</h4>
        <div className="flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {availableLetters.filter(l => !l.used).map((letterObj) => (
              <motion.div
                key={letterObj.id}
                className={`letter-tile bg-gradient-to-br from-blue-600 to-blue-800 text-white w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold cursor-grab shadow-lg hover:shadow-xl transition-all duration-300 ${
                  draggedItem === letterObj.id ? 'dragging opacity-50' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, letterObj.id)}
                onDragEnd={handleDragEnd}
                onClick={() => handleLetterClick(letterObj.id)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                layout
              >
                {letterObj.letter.toUpperCase()}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
