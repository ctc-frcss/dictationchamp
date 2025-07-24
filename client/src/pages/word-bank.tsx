import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Keyboard, Upload, Rocket, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parseFile } from "@/lib/file-parser";
import { useGameState } from "@/hooks/use-game-state";

export default function WordBank() {
  const [, setLocation] = useLocation();
  const [wordInput, setWordInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setWordBank } = useGameState();

  const loadSampleWords = () => {
    const sampleWords = [
      'cat', 'dog', 'bird', 'fish', 'elephant', 'tiger', 'rabbit', 'horse', 
      'apple', 'banana', 'orange', 'grape', 'chair', 'table', 'book', 'pencil'
    ];
    setWordInput(sampleWords.join(', '));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const words = await parseFile(file);
      setWordInput(words.join(', '));
      toast({
        title: "File uploaded successfully!",
        description: `Found ${words.length} words in your file.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to parse file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = () => {
    const textInput = wordInput.trim();
    
    if (!textInput) {
      toast({
        title: "No words found",
        description: "Please enter some words or upload a file to start the game!",
        variant: "destructive",
      });
      return;
    }

    // Parse word input
    const wordBank = textInput.split(/[,\n]/)
      .map(word => word.trim().toLowerCase())
      .filter(word => word.length > 0 && /^[a-zA-Z]+$/.test(word));

    if (wordBank.length === 0) {
      toast({
        title: "No valid words found",
        description: "Please check your input and make sure it contains valid words!",
        variant: "destructive",
      });
      return;
    }

    setWordBank(wordBank);
    setLocation("/game");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        onClick={() => setLocation("/")}
        variant="secondary"
        className="mb-6"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back
      </Button>
      
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-2xl">
          <CardContent className="p-8">
            <h2 className="text-4xl font-fredoka text-center text-secondary-custom mb-8">
              📚 Add Your Word List
            </h2>
            
            {/* Input Methods */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Text Input */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                <h3 className="text-2xl font-fredoka text-primary-custom mb-4 flex items-center">
                  <Keyboard className="mr-2 w-6 h-6" />
                  Type Words
                </h3>
                <Textarea
                  value={wordInput}
                  onChange={(e) => setWordInput(e.target.value)}
                  placeholder="Enter words separated by commas or new lines:

cat, dog, fish
bird
elephant"
                  className="w-full h-32 p-4 border-2 border-secondary-custom/30 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-secondary-custom/30 text-lg"
                />
              </div>
              
              {/* File Upload */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
                <h3 className="text-2xl font-fredoka text-purple-custom mb-4 flex items-center">
                  <Upload className="mr-2 w-6 h-6" />
                  Upload File
                </h3>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-secondary-custom transition-all cursor-pointer"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-2">
                    {isLoading ? "Processing..." : "Click to upload CSV or Excel file"}
                  </p>
                  <p className="text-sm text-gray-500">Supports .csv, .xlsx files</p>
                  <input
                    type="file"
                    id="fileInput"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            
            {/* Sample Words */}
            <div className="bg-accent-custom/20 rounded-2xl p-6 mb-8">
              <h4 className="font-fredoka text-lg text-gray-700 mb-3 flex items-center">
                <Target className="mr-2 w-5 h-5" />
                Try these sample words:
              </h4>
              <Button
                onClick={loadSampleWords}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
              >
                Load Sample Word List
              </Button>
            </div>
            
            {/* Start Game Button */}
            <div className="text-center">
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-success-custom to-secondary-custom text-white text-xl font-fredoka py-6 px-10 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                size="lg"
                disabled={isLoading}
              >
                <Rocket className="mr-3 w-6 h-6" />
                {isLoading ? "Processing..." : "Launch Game!"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
