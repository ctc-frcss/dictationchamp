import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Play, Mic, Palette, Trophy } from "lucide-react";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Mascot Character */}
        <motion.div 
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="w-48 h-48 mx-auto rounded-full shadow-2xl border-8 border-white bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-8xl animate-bounce-slow">
            🦉
          </div>
        </motion.div>
        
        {/* App Title */}
        <motion.h1 
          className="text-6xl md:text-8xl font-fredoka text-primary-custom mb-4 animate-pulse-slow"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Dictation Champ
        </motion.h1>
        
        <motion.p 
          className="text-2xl md:text-3xl text-gray-700 mb-8 font-semibold"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          🎯 Fun Spelling Adventures Await! 🌟
        </motion.p>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Mic, title: "Listen & Spell", desc: "Hear words spoken aloud and spell them out!", color: "from-secondary-custom/20 to-blue-100" },
            { icon: Palette, title: "Drag & Drop", desc: "Move letters to spell words the fun way!", color: "from-purple-custom/20 to-purple-100" },
            { icon: Trophy, title: "Earn Rewards", desc: "Get stars and celebrate your success!", color: "from-accent-custom/20 to-yellow-100" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
            >
              <Card className="h-full hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardContent className={`p-6 bg-gradient-to-br ${feature.color} rounded-lg h-full flex flex-col items-center justify-center`}>
                  <feature.icon className="w-12 h-12 mb-4 text-gray-600" />
                  <h3 className="font-fredoka text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Start Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
        >
          <Button
            onClick={() => setLocation("/word-bank")}
            className="bg-gradient-to-r from-primary-custom to-pink-custom text-white text-2xl font-fredoka py-6 px-12 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-wiggle"
            size="lg"
          >
            <Play className="mr-3 w-6 h-6" />
            Start Your Adventure!
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
