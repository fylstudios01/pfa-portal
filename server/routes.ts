import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIncorporationRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============= INCORPORATION REQUESTS API =============
  
  // Create new incorporation request
  app.post("/api/incorporation-requests", async (req, res) => {
    try {
      const validatedData = insertIncorporationRequestSchema.parse(req.body);
      const request = await storage.createIncorporationRequest(validatedData);
      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        console.error("Error creating incorporation request:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get incorporation request by tracking code
  app.get("/api/incorporation-requests/:trackingCode", async (req, res) => {
    try {
      const { trackingCode } = req.params;
      const request = await storage.getIncorporationRequestByTrackingCode(trackingCode);
      
      if (!request) {
        res.status(404).json({ error: "Request not found" });
        return;
      }
      
      res.json(request);
    } catch (error) {
      console.error("Error fetching incorporation request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all incorporation requests (admin only)
  app.get("/api/incorporation-requests", async (req, res) => {
    try {
      const requests = await storage.getAllIncorporationRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching all requests:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update incorporation request status
  app.patch("/api/incorporation-requests/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        res.status(400).json({ error: "Status is required" });
        return;
      }
      
      const updated = await storage.updateIncorporationRequestStatus(id, status);
      
      if (!updated) {
        res.status(404).json({ error: "Request not found" });
        return;
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating request status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= AUTHENTICATION API =============
  
  // Simple login (checking if user exists)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }
      
      const user = await storage.getUserByUsername(username);
      
      // Simple password check (in production, use bcrypt)
      if (!user || user.password !== password) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      
      // In a real app, you'd create a session/JWT here
      res.json({ success: true, user: { id: user.id, username: user.username } });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
