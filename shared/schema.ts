import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Roles y jerarquías de la PFA
export const ROLES = {
  JEFE_POLICIA: "Jefe de Policía",
  SUBCOMISARIO: "Subcomisario",
  COMISARIO: "Comisario",
  INSPECTOR: "Inspector",
  SUBINSPECTOR: "Subinspector",
  OFICIAL: "Oficial",
  AGENTE: "Agente"
} as const;

export const DEPARTAMENTOS = {
  INCORPORACIONES: "Incorporaciones",
  RECURSOS_HUMANOS: "Recursos Humanos",
  JEFATURA: "Jefatura",
  DENUNCIAS: "Denuncias",
  FEDERAL_911: "911 Federal",
  COMUNICADOS: "Comunicados"
} as const;

// Admin Users Table with roles
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default(ROLES.AGENTE),
  department: text("department").notNull().default(DEPARTAMENTOS.INCORPORACIONES),
  email: text("email"),
  fullName: text("full_name"),
  badge: text("badge"), // Número de placa/legajo
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  department: true,
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
  oathDeclaration: boolean("oath_declaration").notNull(),
  
  // Medical Data (Etapa 5)
  bloodType: text("blood_type"),
  height: text("height"),
  weight: text("weight"),
  healthConditions: text("health_conditions"),
  medicalDeclaration: text("medical_declaration"),
  
  // Final Letter
  formalLetterAccepted: boolean("formal_letter_accepted").default(false),
  
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

// Crime Reports Table (Denuncias)
export const crimeReports = pgTable("crime_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportCode: text("report_code").notNull().unique(), // DEN-####
  status: text("status").notNull().default("Registrada"),
  crimeType: text("crime_type").notNull(), // Tipo de delito federal
  description: text("description").notNull(),
  location: text("location").notNull(),
  dateOfCrime: timestamp("date_of_crime").notNull(),
  reporter: text("reporter").notNull(),
  reporterContact: text("reporter_contact"),
  evidence: text("evidence"), // Descripción de evidencia
  assignedOfficer: varchar("assigned_officer"), // FK a users.id
  priority: text("priority").default("Normal"), // Baja, Normal, Alta, Crítica
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCrimeReportSchema = createInsertSchema(crimeReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CrimeReport = typeof crimeReports.$inferSelect;
export type InsertCrimeReport = z.infer<typeof insertCrimeReportSchema>;

// Bulletins/News (Boletín)
export const bulletins = pgTable("bulletins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // Comunicado, Noticia, Alerta, etc.
  author: varchar("author").notNull(), // FK a users.id
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBulletinSchema = createInsertSchema(bulletins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Bulletin = typeof bulletins.$inferSelect;
export type InsertBulletin = z.infer<typeof insertBulletinSchema>;

// Personnel Files (Legajos - for approved incorporations)
export const personnelFiles = pgTable("personnel_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  incorporationRequestId: varchar("incorporation_request_id").notNull(),
  badge: text("badge").notNull().unique(), // Número de legajo/placa
  role: text("role").notNull().default(ROLES.AGENTE),
  status: text("status").notNull().default("Activo"), // Activo, Licencia, Suspendido, Retirado
  hireDate: timestamp("hire_date").notNull().defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPersonnelFileSchema = createInsertSchema(personnelFiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PersonnelFile = typeof personnelFiles.$inferSelect;
export type InsertPersonnelFile = z.infer<typeof insertPersonnelFileSchema>;
