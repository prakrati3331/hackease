import { pgTable, text, serial, integer, boolean, timestamp, uniqueIndex, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  skills: text("skills").array(),
  interests: text("interests").array(),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  portfolioUrl: text("portfolio_url"),
  resumeUrl: text("resume_url"),
  isOrganizer: boolean("is_organizer").default(false),
  isRecruiter: boolean("is_recruiter").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events model
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location"),
  isVirtual: boolean("is_virtual").default(false),
  organizerId: integer("organizer_id").notNull(),
  maxParticipants: integer("max_participants"),
  registrationDeadline: timestamp("registration_deadline"),
  bannerImageUrl: text("banner_image_url"),
  logoUrl: text("logo_url"),
  website: text("website"),
  status: text("status").default("draft"), // draft, published, completed, cancelled
  primaryColor: text("primary_color").default("#6366F1"),
  secondaryColor: text("secondary_color").default("#EC4899"),
  customFields: jsonb("custom_fields"), // For custom registration form fields
  createdAt: timestamp("created_at").defaultNow(),
});

// Registrations model
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  eventId: integer("event_id").notNull(),
  status: text("status").default("pending"), // pending, approved, rejected
  formData: jsonb("form_data"), // For storing custom registration form data
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    userEventIdx: uniqueIndex("user_event_idx").on(table.userId, table.eventId),
  };
});

// Teams model
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  eventId: integer("event_id").notNull(),
  leaderId: integer("leader_id").notNull(),
  maxMembers: integer("max_members").default(4),
  isOpen: boolean("is_open").default(true), // Whether team is open for new members
  skills: text("skills").array(), // Desired skills for team members
  createdAt: timestamp("created_at").defaultNow(),
});

// TeamMembers model
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role"),
  joinedAt: timestamp("joined_at").defaultNow(),
}, (table) => {
  return {
    userTeamIdx: uniqueIndex("user_team_idx").on(table.userId, table.teamId),
  };
});

// Projects model
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  eventId: integer("event_id").notNull(),
  teamId: integer("team_id").notNull(),
  repoUrl: text("repo_url"),
  demoUrl: text("demo_url"),
  presentationUrl: text("presentation_url"),
  submissionDate: timestamp("submission_date").defaultNow(),
  status: text("status").default("submitted"), // submitted, under_review, approved, rejected
});

// Judges model
export const judges = pgTable("judges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  eventId: integer("event_id").notNull(),
  role: text("role").default("judge"), // Can be judge, head_judge, etc.
}, (table) => {
  return {
    userEventIdx: uniqueIndex("judge_event_idx").on(table.userId, table.eventId),
  };
});

// JudgingCriteria model
export const judgingCriteria = pgTable("judging_criteria", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  name: text("name").notNull(), // E.g. "Technical Difficulty", "Creativity", etc.
  description: text("description"),
  weight: integer("weight").default(1), // For weighted scoring
});

// ProjectScores model
export const projectScores = pgTable("project_scores", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  judgeId: integer("judge_id").notNull(),
  criteriaId: integer("criteria_id").notNull(),
  score: integer("score").notNull(), // Typically 1-10 or 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    projectJudgeCriteriaIdx: uniqueIndex("project_judge_criteria_idx").on(
      table.projectId, table.judgeId, table.criteriaId
    ),
  };
});

// Recruitment model
export const recruitmentProfiles = pgTable("recruitment_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  isSearchable: boolean("is_searchable").default(true),
  jobPreferences: text("job_preferences").array(),
  locationPreferences: text("location_preferences").array(),
  workTypePreference: text("work_type_preference"), // remote, onsite, hybrid
  experienceLevel: text("experience_level"), // entry, mid, senior
  availableFrom: timestamp("available_from"),
});

// Schemas for frontend validation

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ id: true, createdAt: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertJudgeSchema = createInsertSchema(judges).omit({ id: true });
export const insertJudgingCriteriaSchema = createInsertSchema(judgingCriteria).omit({ id: true });
export const insertProjectScoreSchema = createInsertSchema(projectScores).omit({ id: true, createdAt: true });
export const insertRecruitmentProfileSchema = createInsertSchema(recruitmentProfiles).omit({ id: true });

// Types for frontend usage
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Judge = typeof judges.$inferSelect;
export type InsertJudge = z.infer<typeof insertJudgeSchema>;

export type JudgingCriterion = typeof judgingCriteria.$inferSelect;
export type InsertJudgingCriterion = z.infer<typeof insertJudgingCriteriaSchema>;

export type ProjectScore = typeof projectScores.$inferSelect;
export type InsertProjectScore = z.infer<typeof insertProjectScoreSchema>;

export type RecruitmentProfile = typeof recruitmentProfiles.$inferSelect;
export type InsertRecruitmentProfile = z.infer<typeof insertRecruitmentProfileSchema>;
