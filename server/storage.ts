import { type User, type InsertUser, type IncorporationRequest, type InsertIncorporationRequest, type CrimeReport, type InsertCrimeReport, type Bulletin, type InsertBulletin, users, incorporationRequests, crimeReports, bulletins } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Incorporation Request methods
  createIncorporationRequest(request: InsertIncorporationRequest): Promise<IncorporationRequest>;
  getIncorporationRequestByTrackingCode(code: string): Promise<IncorporationRequest | undefined>;
  getAllIncorporationRequests(): Promise<IncorporationRequest[]>;
  updateIncorporationRequestStatus(id: string, status: string): Promise<IncorporationRequest | undefined>;
  
  // Crime Report methods
  createCrimeReport(report: InsertCrimeReport): Promise<CrimeReport>;
  getCrimeReportByCode(code: string): Promise<CrimeReport | undefined>;
  getAllCrimeReports(): Promise<CrimeReport[]>;
  updateCrimeReportStatus(id: string, status: string): Promise<CrimeReport | undefined>;
  
  // Bulletin methods
  createBulletin(bulletin: InsertBulletin): Promise<Bulletin>;
  getAllBulletins(): Promise<Bulletin[]>;
  getPublishedBulletins(): Promise<Bulletin[]>;
  updateBulletin(id: string, updates: Partial<InsertBulletin>): Promise<Bulletin | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users);
    return allUsers;
  }

  // Incorporation Request methods
  async createIncorporationRequest(request: InsertIncorporationRequest): Promise<IncorporationRequest> {
    const [newRequest] = await db
      .insert(incorporationRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async getIncorporationRequestByTrackingCode(code: string): Promise<IncorporationRequest | undefined> {
    const [request] = await db
      .select()
      .from(incorporationRequests)
      .where(eq(incorporationRequests.trackingCode, code));
    return request || undefined;
  }

  async getAllIncorporationRequests(): Promise<IncorporationRequest[]> {
    const requests = await db
      .select()
      .from(incorporationRequests)
      .orderBy(incorporationRequests.createdAt);
    return requests;
  }

  async updateIncorporationRequestStatus(id: string, status: string): Promise<IncorporationRequest | undefined> {
    const [updated] = await db
      .update(incorporationRequests)
      .set({ status, updatedAt: new Date() })
      .where(eq(incorporationRequests.id, id))
      .returning();
    return updated || undefined;
  }

  // Crime Report methods
  async createCrimeReport(report: InsertCrimeReport): Promise<CrimeReport> {
    const [newReport] = await db
      .insert(crimeReports)
      .values(report)
      .returning();
    return newReport;
  }

  async getCrimeReportByCode(code: string): Promise<CrimeReport | undefined> {
    const [report] = await db
      .select()
      .from(crimeReports)
      .where(eq(crimeReports.reportCode, code));
    return report || undefined;
  }

  async getAllCrimeReports(): Promise<CrimeReport[]> {
    const reports = await db
      .select()
      .from(crimeReports)
      .orderBy(crimeReports.createdAt);
    return reports;
  }

  async updateCrimeReportStatus(id: string, status: string): Promise<CrimeReport | undefined> {
    const [updated] = await db
      .update(crimeReports)
      .set({ status, updatedAt: new Date() })
      .where(eq(crimeReports.id, id))
      .returning();
    return updated || undefined;
  }

  // Bulletin methods
  async createBulletin(bulletin: InsertBulletin): Promise<Bulletin> {
    const [newBulletin] = await db
      .insert(bulletins)
      .values(bulletin)
      .returning();
    return newBulletin;
  }

  async getAllBulletins(): Promise<Bulletin[]> {
    const allBulletins = await db
      .select()
      .from(bulletins)
      .orderBy(bulletins.createdAt);
    return allBulletins;
  }

  async getPublishedBulletins(): Promise<Bulletin[]> {
    const published = await db
      .select()
      .from(bulletins)
      .where(eq(bulletins.published, true))
      .orderBy(bulletins.publishedAt);
    return published;
  }

  async updateBulletin(id: string, updates: Partial<InsertBulletin>): Promise<Bulletin | undefined> {
    const [updated] = await db
      .update(bulletins)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bulletins.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
