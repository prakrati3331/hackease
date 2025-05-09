import {
  users, events, registrations, teams, teamMembers, projects,
  judges, judgingCriteria, projectScores, recruitmentProfiles,
  type User, type InsertUser, type Event, type InsertEvent,
  type Registration, type InsertRegistration, type Team, type InsertTeam,
  type TeamMember, type InsertTeamMember, type Project, type InsertProject,
  type Judge, type InsertJudge, type JudgingCriterion, type InsertJudgingCriterion,
  type ProjectScore, type InsertProjectScore, type RecruitmentProfile, type InsertRecruitmentProfile
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  getUsers(): Promise<User[]>;

  // Event operations
  createEvent(event: InsertEvent): Promise<Event>;
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(filters?: { organizerId?: number, status?: string }): Promise<Event[]>;
  updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  // Registration operations
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistration(id: number): Promise<Registration | undefined>;
  getRegistrationByUserAndEvent(userId: number, eventId: number): Promise<Registration | undefined>;
  getRegistrationsByEvent(eventId: number): Promise<Registration[]>;
  getRegistrationsByUser(userId: number): Promise<Registration[]>;
  updateRegistration(id: number, data: Partial<InsertRegistration>): Promise<Registration | undefined>;
  deleteRegistration(id: number): Promise<boolean>;

  // Team operations
  createTeam(team: InsertTeam): Promise<Team>;
  getTeam(id: number): Promise<Team | undefined>;
  getTeamsByEvent(eventId: number): Promise<Team[]>;
  getTeamsByUser(userId: number): Promise<Team[]>;
  updateTeam(id: number, data: Partial<InsertTeam>): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<boolean>;

  // Team Member operations
  addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  getTeamMembersByTeam(teamId: number): Promise<TeamMember[]>;
  getTeamMembersByUser(userId: number): Promise<TeamMember[]>;
  removeTeamMember(id: number): Promise<boolean>;

  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByEvent(eventId: number): Promise<Project[]>;
  getProjectsByTeam(teamId: number): Promise<Project[]>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Judge operations
  addJudge(judge: InsertJudge): Promise<Judge>;
  getJudge(id: number): Promise<Judge | undefined>;
  getJudgesByEvent(eventId: number): Promise<Judge[]>;
  removeJudge(id: number): Promise<boolean>;

  // Judging Criteria operations
  addJudgingCriterion(criterion: InsertJudgingCriterion): Promise<JudgingCriterion>;
  getJudgingCriterion(id: number): Promise<JudgingCriterion | undefined>;
  getJudgingCriteriaByEvent(eventId: number): Promise<JudgingCriterion[]>;
  updateJudgingCriterion(id: number, data: Partial<InsertJudgingCriterion>): Promise<JudgingCriterion | undefined>;
  deleteJudgingCriterion(id: number): Promise<boolean>;

  // Project Scores operations
  addProjectScore(score: InsertProjectScore): Promise<ProjectScore>;
  getProjectScore(id: number): Promise<ProjectScore | undefined>;
  getProjectScoresByProject(projectId: number): Promise<ProjectScore[]>;
  getProjectScoresByJudge(judgeId: number): Promise<ProjectScore[]>;
  updateProjectScore(id: number, data: Partial<InsertProjectScore>): Promise<ProjectScore | undefined>;
  deleteProjectScore(id: number): Promise<boolean>;

  // Recruitment Profile operations
  createRecruitmentProfile(profile: InsertRecruitmentProfile): Promise<RecruitmentProfile>;
  getRecruitmentProfile(id: number): Promise<RecruitmentProfile | undefined>;
  getRecruitmentProfileByUser(userId: number): Promise<RecruitmentProfile | undefined>;
  getRecruitmentProfiles(filters?: { skills?: string[], jobPreferences?: string[], locationPreferences?: string[], workTypePreference?: string, experienceLevel?: string }): Promise<RecruitmentProfile[]>;
  updateRecruitmentProfile(id: number, data: Partial<InsertRecruitmentProfile>): Promise<RecruitmentProfile | undefined>;
  deleteRecruitmentProfile(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private registrations: Map<number, Registration>;
  private teams: Map<number, Team>;
  private teamMembers: Map<number, TeamMember>;
  private projects: Map<number, Project>;
  private judges: Map<number, Judge>;
  private judgingCriteria: Map<number, JudgingCriterion>;
  private projectScores: Map<number, ProjectScore>;
  private recruitmentProfiles: Map<number, RecruitmentProfile>;
  
  private userIdCounter: number;
  private eventIdCounter: number;
  private registrationIdCounter: number;
  private teamIdCounter: number;
  private teamMemberIdCounter: number;
  private projectIdCounter: number;
  private judgeIdCounter: number;
  private criterionIdCounter: number;
  private scoreIdCounter: number;
  private profileIdCounter: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.registrations = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.projects = new Map();
    this.judges = new Map();
    this.judgingCriteria = new Map();
    this.projectScores = new Map();
    this.recruitmentProfiles = new Map();
    
    this.userIdCounter = 1;
    this.eventIdCounter = 1;
    this.registrationIdCounter = 1;
    this.teamIdCounter = 1;
    this.teamMemberIdCounter = 1;
    this.projectIdCounter = 1;
    this.judgeIdCounter = 1;
    this.criterionIdCounter = 1;
    this.scoreIdCounter = 1;
    this.profileIdCounter = 1;

    // Add some sample users for testing
    this.initializeSampleData();
  }

  // Initialize some sample data for development purposes
  private initializeSampleData() {
    // Sample organizer
    this.createUser({
      username: "demo_organizer",
      password: "password123",
      email: "organizer@hacknest.com",
      name: "Demo Organizer",
      bio: "Experienced hackathon organizer",
      skills: ["Project Management", "Event Planning"],
      interests: ["Hackathons", "Education"],
      isOrganizer: true,
      isRecruiter: false,
    });

    // Sample recruiter
    this.createUser({
      username: "demo_recruiter",
      password: "password123",
      email: "recruiter@techinc.com",
      name: "Demo Recruiter",
      bio: "Tech talent recruiter",
      skills: ["Technical Recruiting", "Talent Acquisition"],
      interests: ["Tech Talent", "Hiring"],
      isOrganizer: false,
      isRecruiter: true,
    });

    // Sample participant
    this.createUser({
      username: "demo_participant",
      password: "password123",
      email: "participant@example.com",
      name: "Demo Participant",
      bio: "Passionate developer",
      skills: ["JavaScript", "React", "Node.js"],
      interests: ["Web Development", "AI"],
      isOrganizer: false,
      isRecruiter: false,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Event methods
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const createdAt = new Date();
    const event: Event = { ...insertEvent, id, createdAt };
    this.events.set(id, event);
    return event;
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEvents(filters?: { organizerId?: number, status?: string }): Promise<Event[]> {
    let events = Array.from(this.events.values());
    
    if (filters) {
      if (filters.organizerId !== undefined) {
        events = events.filter(event => event.organizerId === filters.organizerId);
      }
      
      if (filters.status !== undefined) {
        events = events.filter(event => event.status === filters.status);
      }
    }
    
    return events;
  }

  async updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = await this.getEvent(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...data };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Registration methods
  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const id = this.registrationIdCounter++;
    const createdAt = new Date();
    const registration: Registration = { ...insertRegistration, id, createdAt };
    this.registrations.set(id, registration);
    return registration;
  }

  async getRegistration(id: number): Promise<Registration | undefined> {
    return this.registrations.get(id);
  }

  async getRegistrationByUserAndEvent(userId: number, eventId: number): Promise<Registration | undefined> {
    return Array.from(this.registrations.values()).find(
      (reg) => reg.userId === userId && reg.eventId === eventId,
    );
  }

  async getRegistrationsByEvent(eventId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(
      (reg) => reg.eventId === eventId,
    );
  }

  async getRegistrationsByUser(userId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(
      (reg) => reg.userId === userId,
    );
  }

  async updateRegistration(id: number, data: Partial<InsertRegistration>): Promise<Registration | undefined> {
    const registration = await this.getRegistration(id);
    if (!registration) return undefined;
    
    const updatedRegistration = { ...registration, ...data };
    this.registrations.set(id, updatedRegistration);
    return updatedRegistration;
  }

  async deleteRegistration(id: number): Promise<boolean> {
    return this.registrations.delete(id);
  }

  // Team methods
  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = this.teamIdCounter++;
    const createdAt = new Date();
    const team: Team = { ...insertTeam, id, createdAt };
    this.teams.set(id, team);

    // Automatically add team leader as a member
    await this.addTeamMember({
      teamId: id,
      userId: team.leaderId,
      role: "Leader",
    });

    return team;
  }

  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getTeamsByEvent(eventId: number): Promise<Team[]> {
    return Array.from(this.teams.values()).filter(
      (team) => team.eventId === eventId,
    );
  }

  async getTeamsByUser(userId: number): Promise<Team[]> {
    // Find all team memberships for the user
    const memberships = await this.getTeamMembersByUser(userId);
    const teamIds = memberships.map(member => member.teamId);
    
    // Get all teams where the user is a member
    return Array.from(this.teams.values()).filter(
      (team) => teamIds.includes(team.id) || team.leaderId === userId,
    );
  }

  async updateTeam(id: number, data: Partial<InsertTeam>): Promise<Team | undefined> {
    const team = await this.getTeam(id);
    if (!team) return undefined;
    
    const updatedTeam = { ...team, ...data };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  async deleteTeam(id: number): Promise<boolean> {
    // Delete all team members first
    const teamMembers = await this.getTeamMembersByTeam(id);
    for (const member of teamMembers) {
      await this.removeTeamMember(member.id);
    }
    
    return this.teams.delete(id);
  }

  // Team Member methods
  async addTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const id = this.teamMemberIdCounter++;
    const joinedAt = new Date();
    const teamMember: TeamMember = { ...insertTeamMember, id, joinedAt };
    this.teamMembers.set(id, teamMember);
    return teamMember;
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    return this.teamMembers.get(id);
  }

  async getTeamMembersByTeam(teamId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(
      (member) => member.teamId === teamId,
    );
  }

  async getTeamMembersByUser(userId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(
      (member) => member.userId === userId,
    );
  }

  async removeTeamMember(id: number): Promise<boolean> {
    return this.teamMembers.delete(id);
  }

  // Project methods
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByEvent(eventId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.eventId === eventId,
    );
  }

  async getProjectsByTeam(teamId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.teamId === teamId,
    );
  }

  async updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined> {
    const project = await this.getProject(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...data };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    // Delete all scores related to this project
    const scores = await this.getProjectScoresByProject(id);
    for (const score of scores) {
      await this.deleteProjectScore(score.id);
    }
    
    return this.projects.delete(id);
  }

  // Judge methods
  async addJudge(insertJudge: InsertJudge): Promise<Judge> {
    const id = this.judgeIdCounter++;
    const judge: Judge = { ...insertJudge, id };
    this.judges.set(id, judge);
    return judge;
  }

  async getJudge(id: number): Promise<Judge | undefined> {
    return this.judges.get(id);
  }

  async getJudgesByEvent(eventId: number): Promise<Judge[]> {
    return Array.from(this.judges.values()).filter(
      (judge) => judge.eventId === eventId,
    );
  }

  async removeJudge(id: number): Promise<boolean> {
    return this.judges.delete(id);
  }

  // Judging Criteria methods
  async addJudgingCriterion(insertCriterion: InsertJudgingCriterion): Promise<JudgingCriterion> {
    const id = this.criterionIdCounter++;
    const criterion: JudgingCriterion = { ...insertCriterion, id };
    this.judgingCriteria.set(id, criterion);
    return criterion;
  }

  async getJudgingCriterion(id: number): Promise<JudgingCriterion | undefined> {
    return this.judgingCriteria.get(id);
  }

  async getJudgingCriteriaByEvent(eventId: number): Promise<JudgingCriterion[]> {
    return Array.from(this.judgingCriteria.values()).filter(
      (criterion) => criterion.eventId === eventId,
    );
  }

  async updateJudgingCriterion(id: number, data: Partial<InsertJudgingCriterion>): Promise<JudgingCriterion | undefined> {
    const criterion = await this.getJudgingCriterion(id);
    if (!criterion) return undefined;
    
    const updatedCriterion = { ...criterion, ...data };
    this.judgingCriteria.set(id, updatedCriterion);
    return updatedCriterion;
  }

  async deleteJudgingCriterion(id: number): Promise<boolean> {
    return this.judgingCriteria.delete(id);
  }

  // Project Scores methods
  async addProjectScore(insertScore: InsertProjectScore): Promise<ProjectScore> {
    const id = this.scoreIdCounter++;
    const createdAt = new Date();
    const score: ProjectScore = { ...insertScore, id, createdAt };
    this.projectScores.set(id, score);
    return score;
  }

  async getProjectScore(id: number): Promise<ProjectScore | undefined> {
    return this.projectScores.get(id);
  }

  async getProjectScoresByProject(projectId: number): Promise<ProjectScore[]> {
    return Array.from(this.projectScores.values()).filter(
      (score) => score.projectId === projectId,
    );
  }

  async getProjectScoresByJudge(judgeId: number): Promise<ProjectScore[]> {
    return Array.from(this.projectScores.values()).filter(
      (score) => score.judgeId === judgeId,
    );
  }

  async updateProjectScore(id: number, data: Partial<InsertProjectScore>): Promise<ProjectScore | undefined> {
    const score = await this.getProjectScore(id);
    if (!score) return undefined;
    
    const updatedScore = { ...score, ...data };
    this.projectScores.set(id, updatedScore);
    return updatedScore;
  }

  async deleteProjectScore(id: number): Promise<boolean> {
    return this.projectScores.delete(id);
  }

  // Recruitment Profile methods
  async createRecruitmentProfile(insertProfile: InsertRecruitmentProfile): Promise<RecruitmentProfile> {
    const id = this.profileIdCounter++;
    const profile: RecruitmentProfile = { ...insertProfile, id };
    this.recruitmentProfiles.set(id, profile);
    return profile;
  }

  async getRecruitmentProfile(id: number): Promise<RecruitmentProfile | undefined> {
    return this.recruitmentProfiles.get(id);
  }

  async getRecruitmentProfileByUser(userId: number): Promise<RecruitmentProfile | undefined> {
    return Array.from(this.recruitmentProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async getRecruitmentProfiles(filters?: { skills?: string[], jobPreferences?: string[], locationPreferences?: string[], workTypePreference?: string, experienceLevel?: string }): Promise<RecruitmentProfile[]> {
    let profiles = Array.from(this.recruitmentProfiles.values());
    
    if (!filters) return profiles;

    // Get all searchable profiles
    profiles = profiles.filter(profile => profile.isSearchable);
    
    if (filters.skills && filters.skills.length > 0) {
      const userIds = profiles.map(profile => profile.userId);
      const usersWithSkills = Array.from(this.users.values())
        .filter(user => 
          userIds.includes(user.id) && 
          user.skills && 
          filters.skills!.some(skill => user.skills.includes(skill))
        )
        .map(user => user.id);
      
      profiles = profiles.filter(profile => usersWithSkills.includes(profile.userId));
    }
    
    if (filters.jobPreferences && filters.jobPreferences.length > 0) {
      profiles = profiles.filter(profile => 
        profile.jobPreferences && 
        filters.jobPreferences!.some(pref => profile.jobPreferences.includes(pref))
      );
    }
    
    if (filters.locationPreferences && filters.locationPreferences.length > 0) {
      profiles = profiles.filter(profile => 
        profile.locationPreferences && 
        filters.locationPreferences!.some(loc => profile.locationPreferences.includes(loc))
      );
    }
    
    if (filters.workTypePreference) {
      profiles = profiles.filter(profile => profile.workTypePreference === filters.workTypePreference);
    }
    
    if (filters.experienceLevel) {
      profiles = profiles.filter(profile => profile.experienceLevel === filters.experienceLevel);
    }
    
    return profiles;
  }

  async updateRecruitmentProfile(id: number, data: Partial<InsertRecruitmentProfile>): Promise<RecruitmentProfile | undefined> {
    const profile = await this.getRecruitmentProfile(id);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...data };
    this.recruitmentProfiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async deleteRecruitmentProfile(id: number): Promise<boolean> {
    return this.recruitmentProfiles.delete(id);
  }
}

export const storage = new MemStorage();
