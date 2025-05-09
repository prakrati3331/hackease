import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateCard } from "@/components/recruitment/CandidateCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchIcon, Briefcase, MapPin, GridIcon, ListIcon, FilterIcon, Info, XIcon } from "lucide-react";

export default function RecruitmentPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [jobType, setJobType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  
  // Fetch recruitment profiles
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["/api/recruitment-profiles"],
  });
  
  // Filter profiles based on search term and filters
  const filteredProfiles = profiles?.filter((profile: any) => {
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = profile.user.name.toLowerCase().includes(searchLower);
      const skillsMatch = profile.user.skills.some((skill: string) => 
        skill.toLowerCase().includes(searchLower)
      );
      
      if (!nameMatch && !skillsMatch) return false;
    }
    
    // Filter by selected skills
    if (selectedSkills.length > 0) {
      const hasSkill = selectedSkills.some(skill => 
        profile.user.skills.includes(skill)
      );
      if (!hasSkill) return false;
    }
    
    // Filter by job type
    if (jobType && !profile.workTypePreference.includes(jobType)) {
      return false;
    }
    
    // Filter by location
    if (location && !profile.locationPreferences.includes(location)) {
      return false;
    }
    
    // Filter by experience level
    if (experienceLevel && profile.experienceLevel !== experienceLevel) {
      return false;
    }
    
    return true;
  });

  // All available skills for filtering
  const availableSkills = Array.from(
    new Set(profiles?.flatMap((profile: any) => profile.user.skills) || [])
  ).sort();
  
  // All available locations
  const availableLocations = Array.from(
    new Set(profiles?.flatMap((profile: any) => profile.locationPreferences) || [])
  ).sort();

  // Handle adding a skill filter
  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Handle removing a skill filter
  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSkills([]);
    setJobType("");
    setLocation("");
    setExperienceLevel("");
  };

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout title="Recruitment Portal">
        <div className="space-y-6">
          <Skeleton className="h-12 w-full max-w-lg" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Recruitment Portal | HackEase</title>
        <meta name="description" content="Find and connect with talented developers from hackathons" />
      </Helmet>
      
      <DashboardLayout 
        title="Recruitment Portal" 
        description="Discover talented developers who participated in hackathons"
      >
        <Tabs defaultValue="candidates" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="candidates" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Saved Profiles
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="candidates">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      placeholder="Search by name or skill..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Work Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Work Type</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="onsite">Onsite</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Experience Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Experience</SelectItem>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                      title={viewMode === "grid" ? "List View" : "Grid View"}
                    >
                      {viewMode === "grid" ? (
                        <ListIcon className="h-4 w-4" />
                      ) : (
                        <GridIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Select onValueChange={handleAddSkill}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSkills.map(skill => (
                          <SelectItem key={skill} value={skill}>
                            {skill}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Location</SelectItem>
                        {availableLocations.map(loc => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {(selectedSkills.length > 0 || jobType || location || experienceLevel) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters} 
                        className="h-9 gap-1"
                      >
                        <FilterIcon className="h-4 w-4" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
                
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedSkills.map(skill => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="flex items-center gap-1 bg-primary/10 text-primary"
                      >
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)}>
                          <XIcon className="h-3 w-3 ml-1" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {filteredProfiles?.length > 0 ? (
              <div 
                className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                }
              >
                {filteredProfiles.map((profile: any) => (
                  <CandidateCard key={profile.id} candidate={profile} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">No Matching Candidates</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters to see more potential candidates.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {profiles?.length > 0 && filteredProfiles?.length > 0 && (
              <div className="mt-6 text-center text-gray-500">
                Showing {filteredProfiles.length} of {profiles.length} candidates
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Coming Soon</AlertTitle>
              <AlertDescription>
                The saved profiles feature is currently under development. Check back soon!
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </DashboardLayout>
    </>
  );
}
