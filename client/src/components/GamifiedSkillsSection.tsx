import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, School, Trophy, Star, Zap, Target, Award } from 'lucide-react';
import GamifiedSkill from './GamifiedSkill';

interface Skill {
  name: string;
  level: number;
  endorsements: number;
}

interface GamifiedSkillsSectionProps {
  initialSkills: Skill[];
}

// Function to simulate gaining XP (will connect to backend in real app)
const gainExperience = (skill: Skill): Skill => {
  // Gain 5-10% experience randomly
  const gain = Math.floor(Math.random() * 6) + 5;
  const newLevel = Math.min(100, skill.level + gain);
  return {
    ...skill,
    level: newLevel
  };
};

export default function GamifiedSkillsSection({ initialSkills }: GamifiedSkillsSectionProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>(initialSkills);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelingSkill, setLevelingSkill] = useState<string | null>(null);
  
  // XP and level system
  const [skillPoints, setSkillPoints] = useState(15);
  const [streak, setStreak] = useState(3);
  
  // Filter skills based on search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredSkills(skills);
      return;
    }
    
    const filtered = skills.filter(skill => 
      skill.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSkills(filtered);
  };
  
  // Handle skill practice (level up)
  const handlePracticeSkill = (skillName: string) => {
    if (skillPoints <= 0) {
      // Not enough skill points
      return;
    }
    
    setLevelingSkill(skillName);
    setSkillPoints(prev => prev - 1);
    
    // Update the skill level
    const updatedSkills = skills.map(skill => {
      if (skill.name === skillName) {
        return gainExperience(skill);
      }
      return skill;
    });
    
    setSkills(updatedSkills);
    setFilteredSkills(
      searchQuery 
        ? updatedSkills.filter(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : updatedSkills
    );
  };
  
  // Handle level up completion
  const handleLevelUpComplete = () => {
    setLevelingSkill(null);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              Skill Progression
            </CardTitle>
            <div className="relative w-40">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter skills..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Gamification Stats */}
          <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mr-3">
                <Star className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-medium">Skill Points</div>
                <div className="text-2xl font-bold">{skillPoints}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-10 w-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mr-3">
                <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm font-medium">Daily Streak</div>
                <div className="text-2xl font-bold">{streak} days</div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="border-dashed"
              onClick={() => setSkillPoints(prev => prev + 5)}
            >
              <Plus className="h-4 w-4 mr-1" /> Claim Daily Points
            </Button>
          </div>
          
          {/* Skills List */}
          <div className="space-y-6">
            {filteredSkills.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No skills match your filter
              </div>
            ) : (
              filteredSkills.map((skill) => (
                <div key={skill.name} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <GamifiedSkill
                      name={skill.name}
                      level={skill.level}
                      endorsements={skill.endorsements}
                      isLevelUp={levelingSkill === skill.name}
                      onLevelUpComplete={handleLevelUpComplete}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 mt-1"
                    disabled={skillPoints <= 0 || levelingSkill !== null}
                    onClick={() => handlePracticeSkill(skill.name)}
                  >
                    <Target className="h-4 w-4 mr-1" />
                    Practice
                  </Button>
                </div>
              ))
            )}
            
            <Button variant="outline" className="w-full mt-4">
              <School className="mr-2 h-4 w-4" />
              Add New Skill
            </Button>
          </div>
          
          {/* Skill Points Info */}
          {skillPoints <= 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-sm"
            >
              <p className="text-amber-800 dark:text-amber-300">
                <span className="font-semibold">Out of skill points!</span> Come back tomorrow for a 
                new daily allocation or complete challenges to earn more.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}