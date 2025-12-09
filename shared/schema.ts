import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users Table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Incorporation Requests Table
export const incorporationRequests = pgTable("incorporation_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingCode: text("tracking_code").notNull().unique(),
  status: text("status").notNull().default("En Revisión"),
  
  // Personal Data (IC)
  name: text("name").notNull(),
  surname: text("surname").notNull(),
  gender: text("gender").notNull(),
  civilStatus: text("civil_status").notNull(),
  age: integer("age").notNull(),
  nationality: text("nationality").notNull(),
  birthplace: text("birthplace").notNull(),
  idType: text("id_type").notNull(),
  idNumber: text("id_number").notNull(),
  
  // Contact (OOC)
  email: text("email").notNull(),
  discord: text("discord").notNull(),
  roblox: text("roblox").notNull(),
  
  // Education & Background
  educationLevel: text("education_level").notNull(),
  educationTitle: text("education_title").notNull(),
  hasCriminalRecord: boolean("has_criminal_record").notNull().default(false),
  recordCompetence: text("record_competence"),
  recordDescription: text("record_description"),
  activeCauses: text("active_causes"),
  
  // Exam Responses
  motive: text("motive").notNull(),
  exam_1: text("exam_1").notNull(),
  exam_2: text("exam_2").notNull(),
  exam_3: text("exam_3").notNull(),
  exam_4: text("exam_4").notNull(),
  exam_5: text("exam_5").notNull(),
  
  // Photo & Declarations
  photo: text("photo").notNull(),
  medicalDeclaration: boolean("medical_declaration").notNull(),
  oathDeclaration: boolean("oath_declaration").notNull(),
  
  // Metadata
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertIncorporationRequestSchema = createInsertSchema(incorporationRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type IncorporationRequest = typeof incorporationRequests.$inferSelect;
export type InsertIncorporationRequest = z.infer<typeof insertIncorporationRequestSchema>;
