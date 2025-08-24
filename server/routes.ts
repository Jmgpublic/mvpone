import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertSiteSchema, insertSpaceSchema, insertResidentSchema, insertLeaseSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Authentication routes
  setupAuth(app);

  // Sites routes
  app.get("/api/sites", async (req, res) => {
    try {
      const sites = await storage.getSites();
      res.json(sites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sites" });
    }
  });

  app.post("/api/sites", async (req, res) => {
    try {
      const validatedData = insertSiteSchema.parse(req.body);
      const site = await storage.createSite(validatedData);
      res.status(201).json(site);
    } catch (error) {
      res.status(400).json({ message: "Invalid site data" });
    }
  });

  // Spaces routes
  app.get("/api/spaces", async (req, res) => {
    try {
      const spaces = await storage.getSpaces();
      res.json(spaces);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch spaces" });
    }
  });

  app.post("/api/spaces", async (req, res) => {
    try {
      const validatedData = insertSpaceSchema.parse(req.body);
      const space = await storage.createSpace(validatedData);
      res.status(201).json(space);
    } catch (error) {
      res.status(400).json({ message: "Invalid space data" });
    }
  });

  // Residents routes
  app.get("/api/residents", async (req, res) => {
    try {
      const residents = await storage.getResidents();
      res.json(residents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch residents" });
    }
  });

  app.post("/api/residents", async (req, res) => {
    try {
      const validatedData = insertResidentSchema.parse(req.body);
      const resident = await storage.createResident(validatedData);
      res.status(201).json(resident);
    } catch (error) {
      res.status(400).json({ message: "Invalid resident data" });
    }
  });

  // Leases routes
  app.get("/api/leases", async (req, res) => {
    try {
      const leases = await storage.getLeases();
      res.json(leases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leases" });
    }
  });

  app.post("/api/leases", async (req, res) => {
    try {
      const validatedData = insertLeaseSchema.parse(req.body);
      const lease = await storage.createLease(validatedData);
      res.status(201).json(lease);
    } catch (error) {
      res.status(400).json({ message: "Invalid lease data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
