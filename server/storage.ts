import { type User, type InsertUser, type IncorporationRequest, type InsertIncorporationRequest, users, incorporationRequests } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Incorporation Request methods
  createIncorporationRequest(request: InsertIncorporationRequest): Promise<IncorporationRequest>;
  getIncorporationRequestByTrackingCode(code: string): Promise<IncorporationRequest | undefined>;
  getAllIncorporationRequests(): Promise<IncorporationRequest[]>;
  updateIncorporationRequestStatus(id: string, status: string): Promise<IncorporationRequest | undefined>;
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
}

export const storage = new DatabaseStorage();
