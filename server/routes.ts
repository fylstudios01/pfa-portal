import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIncorporationRequestSchema, insertCrimeReportSchema, insertBulletinSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============= INCORPORATION REQUESTS API =============
  
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

  app.get("/api/incorporation-requests", async (req, res) => {
    try {
      const requests = await storage.getAllIncorporationRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching all requests:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

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

  // ============= CRIME REPORTS API =============
  
  app.post("/api/crime-reports", async (req, res) => {
    try {
      const reportCode = `DEN-${Math.floor(Math.random() * 9000 + 1000)}`;
      const validatedData = insertCrimeReportSchema.parse({ ...req.body, reportCode });
      const report = await storage.createCrimeReport(validatedData);
      res.json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid report data", details: error.errors });
      } else {
        console.error("Error creating crime report:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.get("/api/crime-reports/:reportCode", async (req, res) => {
    try {
      const { reportCode } = req.params;
      const report = await storage.getCrimeReportByCode(reportCode);
      
      if (!report) {
        res.status(404).json({ error: "Report not found" });
        return;
      }
      
      res.json(report);
    } catch (error) {
      console.error("Error fetching crime report:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/crime-reports", async (req, res) => {
    try {
      const reports = await storage.getAllCrimeReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching crime reports:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= BULLETINS API =============
  
  app.post("/api/bulletins", async (req, res) => {
    try {
      const validatedData = insertBulletinSchema.parse(req.body);
      const bulletin = await storage.createBulletin(validatedData);
      res.json(bulletin);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid bulletin data", details: error.errors });
      } else {
        console.error("Error creating bulletin:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.get("/api/bulletins/published", async (req, res) => {
    try {
      const bulletins = await storage.getPublishedBulletins();
      res.json(bulletins);
    } catch (error) {
      console.error("Error fetching bulletins:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/bulletins", async (req, res) => {
    try {
      const bulletins = await storage.getAllBulletins();
      res.json(bulletins);
    } catch (error) {
      console.error("Error fetching all bulletins:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= AUTHENTICATION API =============
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role,
          department: user.department 
        } 
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
