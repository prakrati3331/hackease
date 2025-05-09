import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, insertEventSchema, insertRegistrationSchema, 
  insertTeamSchema, insertTeamMemberSchema, insertProjectSchema,
  insertJudgeSchema, insertJudgingCriteriaSchema, insertProjectScoreSchema,
  insertRecruitmentProfileSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // All API routes should be prefixed with /api
  
  // Auth routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      
      const user = await storage.createUser(validatedData);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating user' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  });

  // User routes
  app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  });

  app.patch('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Validate only the fields being updated
      const validatedData = insertUserSchema.partial().parse(req.body);
      
      const updatedUser = await storage.updateUser(id, validatedData);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = updatedUser!;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error updating user' });
    }
  });

  // Event routes
  app.post('/api/events', async (req: Request, res: Response) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      
      // Verify that organizer exists
      const organizer = await storage.getUser(validatedData.organizerId);
      if (!organizer) {
        return res.status(400).json({ message: 'Organizer not found' });
      }
      
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid event data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating event' });
    }
  });

  app.get('/api/events', async (req: Request, res: Response) => {
    try {
      const organizerId = req.query.organizerId ? parseInt(req.query.organizerId as string) : undefined;
      const status = req.query.status as string | undefined;
      
      const events = await storage.getEvents({ organizerId, status });
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events' });
    }
  });

  app.get('/api/events/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching event' });
    }
  });

  app.patch('/api/events/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Validate only the fields being updated
      const validatedData = insertEventSchema.partial().parse(req.body);
      
      const updatedEvent = await storage.updateEvent(id, validatedData);
      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid event data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error updating event' });
    }
  });

  app.delete('/api/events/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      await storage.deleteEvent(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting event' });
    }
  });

  // Registration routes
  app.post('/api/registrations', async (req: Request, res: Response) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      
      // Check if user and event exist
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      
      const event = await storage.getEvent(validatedData.eventId);
      if (!event) {
        return res.status(400).json({ message: 'Event not found' });
      }
      
      // Check if user is already registered for this event
      const existingRegistration = await storage.getRegistrationByUserAndEvent(
        validatedData.userId,
        validatedData.eventId
      );
      
      if (existingRegistration) {
        return res.status(400).json({ message: 'User already registered for this event' });
      }
      
      const registration = await storage.createRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid registration data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating registration' });
    }
  });

  app.get('/api/events/:eventId/registrations', async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      
      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const registrations = await storage.getRegistrationsByEvent(eventId);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching registrations' });
    }
  });

  app.get('/api/users/:userId/registrations', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const registrations = await storage.getRegistrationsByUser(userId);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching registrations' });
    }
  });

  app.patch('/api/registrations/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const registration = await storage.getRegistration(id);
      
      if (!registration) {
        return res.status(404).json({ message: 'Registration not found' });
      }
      
      // Validate only the fields being updated
      const validatedData = insertRegistrationSchema.partial().parse(req.body);
      
      const updatedRegistration = await storage.updateRegistration(id, validatedData);
      res.json(updatedRegistration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid registration data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error updating registration' });
    }
  });

  // Team routes
  app.post('/api/teams', async (req: Request, res: Response) => {
    try {
      const validatedData = insertTeamSchema.parse(req.body);
      
      // Check if event exists
      const event = await storage.getEvent(validatedData.eventId);
      if (!event) {
        return res.status(400).json({ message: 'Event not found' });
      }
      
      // Check if leader exists and is registered for the event
      const leader = await storage.getUser(validatedData.leaderId);
      if (!leader) {
        return res.status(400).json({ message: 'Team leader not found' });
      }
      
      const leaderRegistration = await storage.getRegistrationByUserAndEvent(
        validatedData.leaderId,
        validatedData.eventId
      );
      
      if (!leaderRegistration) {
        return res.status(400).json({ message: 'Team leader is not registered for this event' });
      }
      
      const team = await storage.createTeam(validatedData);
      res.status(201).json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid team data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating team' });
    }
  });

  app.get('/api/events/:eventId/teams', async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      
      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const teams = await storage.getTeamsByEvent(eventId);
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching teams' });
    }
  });

  app.get('/api/users/:userId/teams', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const teams = await storage.getTeamsByUser(userId);
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching teams' });
    }
  });

  app.get('/api/teams/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const team = await storage.getTeam(id);
      
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching team' });
    }
  });

  app.patch('/api/teams/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const team = await storage.getTeam(id);
      
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      
      // Validate only the fields being updated
      const validatedData = insertTeamSchema.partial().parse(req.body);
      
      const updatedTeam = await storage.updateTeam(id, validatedData);
      res.json(updatedTeam);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid team data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error updating team' });
    }
  });

  // Team Members routes
  app.post('/api/teams/:teamId/members', async (req: Request, res: Response) => {
    try {
      const teamId = parseInt(req.params.teamId);
      
      // Check if team exists
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      
      const teamMembers = await storage.getTeamMembersByTeam(teamId);
      if (teamMembers.length >= team.maxMembers) {
        return res.status(400).json({ message: 'Team is already full' });
      }
      
      // Get the validated data and ensure teamId matches the URL parameter
      const validatedData = {
        ...insertTeamMemberSchema.parse(req.body),
        teamId
      };
      
      // Check if user exists and is registered for the event
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      
      const userRegistration = await storage.getRegistrationByUserAndEvent(
        validatedData.userId,
        team.eventId
      );
      
      if (!userRegistration) {
        return res.status(400).json({ message: 'User is not registered for this event' });
      }
      
      // Check if user is already in this team
      const existingMembership = teamMembers.find(
        member => member.userId === validatedData.userId
      );
      
      if (existingMembership) {
        return res.status(400).json({ message: 'User is already a member of this team' });
      }
      
      const teamMember = await storage.addTeamMember(validatedData);
      res.status(201).json(teamMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid team member data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error adding team member' });
    }
  });

  app.get('/api/teams/:teamId/members', async (req: Request, res: Response) => {
    try {
      const teamId = parseInt(req.params.teamId);
      
      // Check if team exists
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      
      const members = await storage.getTeamMembersByTeam(teamId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching team members' });
    }
  });

  app.delete('/api/teams/:teamId/members/:memberId', async (req: Request, res: Response) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const memberId = parseInt(req.params.memberId);
      
      // Check if team exists
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      
      // Check if member is part of the team
      const member = await storage.getTeamMember(memberId);
      if (!member || member.teamId !== teamId) {
        return res.status(404).json({ message: 'Team member not found' });
      }
      
      // Don't allow removal of team leader
      if (member.userId === team.leaderId) {
        return res.status(400).json({ message: 'Cannot remove team leader' });
      }
      
      await storage.removeTeamMember(memberId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error removing team member' });
    }
  });

  // Project routes
  app.post('/api/projects', async (req: Request, res: Response) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      
      // Check if event and team exist
      const event = await storage.getEvent(validatedData.eventId);
      if (!event) {
        return res.status(400).json({ message: 'Event not found' });
      }
      
      const team = await storage.getTeam(validatedData.teamId);
      if (!team) {
        return res.status(400).json({ message: 'Team not found' });
      }
      
      // Ensure team is part of the event
      if (team.eventId !== validatedData.eventId) {
        return res.status(400).json({ message: 'Team is not part of this event' });
      }
      
      // Check if team already has a project for this event
      const existingProjects = await storage.getProjectsByTeam(validatedData.teamId);
      if (existingProjects.length > 0) {
        return res.status(400).json({ message: 'Team already has a project for this event' });
      }
      
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid project data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating project' });
    }
  });

  app.get('/api/events/:eventId/projects', async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      
      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const projects = await storage.getProjectsByEvent(eventId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching projects' });
    }
  });

  app.get('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching project' });
    }
  });

  app.patch('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Validate only the fields being updated
      const validatedData = insertProjectSchema.partial().parse(req.body);
      
      const updatedProject = await storage.updateProject(id, validatedData);
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid project data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error updating project' });
    }
  });

  // Judging routes
  app.post('/api/events/:eventId/judges', async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      
      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Get the validated data and ensure eventId matches the URL parameter
      const validatedData = {
        ...insertJudgeSchema.parse(req.body),
        eventId
      };
      
      // Check if user exists
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      
      // Check if user is already a judge for this event
      const judges = await storage.getJudgesByEvent(eventId);
      const existingJudge = judges.find(judge => judge.userId === validatedData.userId);
      
      if (existingJudge) {
        return res.status(400).json({ message: 'User is already a judge for this event' });
      }
      
      const judge = await storage.addJudge(validatedData);
      res.status(201).json(judge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid judge data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error adding judge' });
    }
  });

  app.get('/api/events/:eventId/judges', async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      
      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const judges = await storage.getJudgesByEvent(eventId);
      res.json(judges);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching judges' });
    }
  });

  app.delete('/api/events/:eventId/judges/:judgeId', async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const judgeId = parseInt(req.params.judgeId);
      
      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Check if judge is assigned to this event
      const judge = await storage.getJudge(judgeId);
      if (!judge || judge.eventId !== eventId) {
        return res.status(404).json({ message: 'Judge not found for this event' });
      }
      
      await storage.removeJudge(judgeId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error removing judge' });
    }
  });

  // Judging Criteria routes
  app.post('/api/events/:eventId/criteria', async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      
      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Get the validated data and ensure eventId matches the URL parameter
      const validatedData = {
        ...insertJudgingCriteriaSchema.parse(req.body),
        eventId
      };
      
      const criterion = await storage.addJudgingCriterion(validatedData);
      res.status(201).json(criterion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid criterion data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error adding judging criterion' });
    }
  });

  app.get('/api/events/:eventId/criteria', async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      
      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const criteria = await storage.getJudgingCriteriaByEvent(eventId);
      res.json(criteria);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching judging criteria' });
    }
  });

  // Project Scores routes
  app.post('/api/projects/:projectId/scores', async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      
      // Check if project exists
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Validate the score data
      const validatedData = {
        ...insertProjectScoreSchema.parse(req.body),
        projectId
      };
      
      // Check if judge exists and is assigned to this event
      const judge = await storage.getJudge(validatedData.judgeId);
      if (!judge || judge.eventId !== project.eventId) {
        return res.status(400).json({ message: 'Judge is not assigned to this event' });
      }
      
      // Check if criterion exists and is for this event
      const criterion = await storage.getJudgingCriterion(validatedData.criteriaId);
      if (!criterion || criterion.eventId !== project.eventId) {
        return res.status(400).json({ message: 'Criterion is not for this event' });
      }
      
      // Check if this judge has already scored this project for this criterion
      const projectScores = await storage.getProjectScoresByProject(projectId);
      const existingScore = projectScores.find(
        score => score.judgeId === validatedData.judgeId && score.criteriaId === validatedData.criteriaId
      );
      
      if (existingScore) {
        // Update the existing score instead of creating a new one
        const updatedScore = await storage.updateProjectScore(existingScore.id, {
          score: validatedData.score,
          comment: validatedData.comment
        });
        return res.json(updatedScore);
      }
      
      const score = await storage.addProjectScore(validatedData);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid score data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error adding project score' });
    }
  });

  app.get('/api/projects/:projectId/scores', async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      
      // Check if project exists
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      const scores = await storage.getProjectScoresByProject(projectId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching project scores' });
    }
  });

  // Recruitment routes
  app.post('/api/recruitment-profiles', async (req: Request, res: Response) => {
    try {
      const validatedData = insertRecruitmentProfileSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      
      // Check if user already has a recruitment profile
      const existingProfile = await storage.getRecruitmentProfileByUser(validatedData.userId);
      if (existingProfile) {
        return res.status(400).json({ message: 'User already has a recruitment profile' });
      }
      
      const profile = await storage.createRecruitmentProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid profile data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating recruitment profile' });
    }
  });

  app.get('/api/recruitment-profiles', async (req: Request, res: Response) => {
    try {
      // Parse filter parameters
      const filters: {
        skills?: string[];
        jobPreferences?: string[];
        locationPreferences?: string[];
        workTypePreference?: string;
        experienceLevel?: string;
      } = {};
      
      if (req.query.skills) {
        filters.skills = (req.query.skills as string).split(',');
      }
      
      if (req.query.jobPreferences) {
        filters.jobPreferences = (req.query.jobPreferences as string).split(',');
      }
      
      if (req.query.locationPreferences) {
        filters.locationPreferences = (req.query.locationPreferences as string).split(',');
      }
      
      if (req.query.workTypePreference) {
        filters.workTypePreference = req.query.workTypePreference as string;
      }
      
      if (req.query.experienceLevel) {
        filters.experienceLevel = req.query.experienceLevel as string;
      }
      
      const profiles = await storage.getRecruitmentProfiles(filters);
      
      // Fetch user data for each profile
      const profilesWithUserData = await Promise.all(
        profiles.map(async (profile) => {
          const user = await storage.getUser(profile.userId);
          if (!user) return profile;
          
          const { password, ...userWithoutPassword } = user;
          return {
            ...profile,
            user: userWithoutPassword
          };
        })
      );
      
      res.json(profilesWithUserData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching recruitment profiles' });
    }
  });

  app.get('/api/users/:userId/recruitment-profile', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const profile = await storage.getRecruitmentProfileByUser(userId);
      if (!profile) {
        return res.status(404).json({ message: 'Recruitment profile not found' });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching recruitment profile' });
    }
  });

  app.patch('/api/recruitment-profiles/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const profile = await storage.getRecruitmentProfile(id);
      
      if (!profile) {
        return res.status(404).json({ message: 'Recruitment profile not found' });
      }
      
      // Validate only the fields being updated
      const validatedData = insertRecruitmentProfileSchema.partial().parse(req.body);
      
      const updatedProfile = await storage.updateRecruitmentProfile(id, validatedData);
      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid profile data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error updating recruitment profile' });
    }
  });

  // Resume parsing endpoint (mock functionality)
  app.post('/api/resume-parse', async (req: Request, res: Response) => {
    try {
      // This would normally extract skills, experience, etc. from a resume
      // For this implementation, we're mocking the functionality
      const mockParsedData = {
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        experience: [
          { title: 'Software Engineer', company: 'Tech Corp', duration: '2 years' },
          { title: 'Frontend Developer', company: 'Web Solutions', duration: '1 year' }
        ],
        education: [
          { degree: 'BS Computer Science', institution: 'Tech University', year: '2020' }
        ]
      };
      
      // Simulate processing time
      setTimeout(() => {
        res.json({
          success: true,
          data: mockParsedData
        });
      }, 1000);
    } catch (error) {
      res.status(500).json({ message: 'Error parsing resume' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
