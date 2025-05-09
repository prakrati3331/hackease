import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Sparkles, ArrowUp } from 'lucide-react';
import ConfettiGenerator from 'confetti-js';

interface GamifiedSkillProps {
  name: string;
  level: number;
  endorsements: number;
  isLevelUp?: boolean;
  onLevelUpComplete?: () => void;
}

export default function GamifiedSkill({
  name,
  level,
  endorsements,
  isLevelUp = false,
  onLevelUpComplete
}: GamifiedSkillProps) {
  const [animatedLevel, setAnimatedLevel] = useState(isLevelUp ? level - 5 : level);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstance = useRef<any>(null);

  // Define skill levels and corresponding badges
  const getSkillLevel = (level: number) => {
    if (level < 30) return { name: 'Beginner', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
    if (level < 60) return { name: 'Intermediate', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' };
    if (level < 85) return { name: 'Advanced', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' };
    return { name: 'Expert', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
  };

  // Get current and previous skill level
  const currentLevel = getSkillLevel(level);
  const previousLevel = isLevelUp ? getSkillLevel(level - 5) : currentLevel;

  // Animate level increase effect
  useEffect(() => {
    if (isLevelUp) {
      // Start with previous level value
      setAnimatedLevel(level - 5);
      
      // Trigger level up animation after a short delay
      const timer = setTimeout(() => {
        setShowLevelUp(true);
        setShowConfetti(true);
        
        // Animate to the new level
        const increment = setTimeout(() => {
          setAnimatedLevel(level);
        }, 500);
        
        return () => clearTimeout(increment);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isLevelUp, level]);

  // Handle confetti effect
  useEffect(() => {
    if (showConfetti && confettiCanvasRef.current) {
      const confettiSettings = {
        target: confettiCanvasRef.current,
        max: 80,
        size: 1.5,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
        clock: 25,
        start_from_edge: true,
        respawn: false,
      };
      
      confettiInstance.current = new ConfettiGenerator(confettiSettings);
      confettiInstance.current.render();
      
      // Clean up confetti after animation
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setShowLevelUp(false);
        if (onLevelUpComplete) onLevelUpComplete();
      }, 3000);
      
      return () => {
        if (confettiInstance.current) {
          confettiInstance.current.clear();
        }
        clearTimeout(timer);
      };
    }
  }, [showConfetti, onLevelUpComplete]);

  return (
    <div className="relative space-y-1">
      {/* Confetti canvas for celebration */}
      {showConfetti && (
        <canvas 
          ref={confettiCanvasRef} 
          className="fixed inset-0 w-full h-full pointer-events-none z-50"
        />
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-medium">{name}</span>
          <Badge className={`ml-2 ${currentLevel.color}`}>
            {currentLevel.name}
          </Badge>
        </div>
        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
          {endorsements} endorsements
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Progress value={animatedLevel} className="h-2" />
          
          {/* Animated skill level indicator */}
          {isLevelUp && showLevelUp && previousLevel.name !== currentLevel.name && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: -30 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-0 right-0 transform"
            >
              <div className="flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-3 py-1 text-xs font-medium">
                <ArrowUp className="h-3 w-3 mr-1" />
                Level Up!
              </div>
            </motion.div>
          )}
        </div>
        <motion.span 
          className="text-xs"
          key={animatedLevel}
          initial={isLevelUp ? { scale: 1 } : {}}
          animate={isLevelUp ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {animatedLevel}%
        </motion.span>
      </div>
      
      {/* Level up celebration overlay */}
      <AnimatePresence>
        {isLevelUp && showLevelUp && previousLevel.name !== currentLevel.name && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-40"
            onClick={() => {
              setShowLevelUp(false);
              setShowConfetti(false);
              if (onLevelUpComplete) onLevelUpComplete();
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl max-w-md mx-4 text-center"
            >
              <div className="mb-4 h-16 w-16 mx-auto bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Skill Level Up!</h3>
              <p className="mb-3">
                Your <span className="font-semibold">{name}</span> skill has advanced from{' '}
                <Badge className={previousLevel.color}>{previousLevel.name}</Badge> to{' '}
                <Badge className={currentLevel.color}>{currentLevel.name}</Badge>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Keep practicing to unlock more achievements!
              </p>
              <Button onClick={() => {
                setShowLevelUp(false);
                setShowConfetti(false);
                if (onLevelUpComplete) onLevelUpComplete();
              }}>
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}