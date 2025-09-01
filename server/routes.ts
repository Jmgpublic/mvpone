import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertSiteSchema, insertSpaceSchema, insertResidentSchema, insertLeaseSchema, insertFunderSchema, insertLeaseFunderSchema, insertRevenueEventSchema } from "@shared/schema";

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

  // Funders routes
  app.get("/api/funders", async (req, res) => {
    try {
      const funders = await storage.getFunders();
      res.json(funders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch funders" });
    }
  });

  app.post("/api/funders", async (req, res) => {
    try {
      const validatedData = insertFunderSchema.parse(req.body);
      const funder = await storage.createFunder(validatedData);
      res.status(201).json(funder);
    } catch (error) {
      res.status(400).json({ message: "Invalid funder data" });
    }
  });

  // Lease Funders routes
  app.get("/api/lease-funders/:leaseId", async (req, res) => {
    try {
      const leaseFunders = await storage.getLeaseFunders(req.params.leaseId);
      res.json(leaseFunders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lease funders" });
    }
  });

  // Revenue Events routes
  app.get("/api/revenue-events", async (req, res) => {
    try {
      const revenueEvents = await storage.getRevenueEvents();
      res.json(revenueEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue events" });
    }
  });

  app.get("/api/revenue-events/:leaseId", async (req, res) => {
    try {
      const revenueEvents = await storage.getRevenueEventsByLease(req.params.leaseId);
      res.json(revenueEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue events for lease" });
    }
  });

  // Comprehensive lease creation with funding and revenue generation
  app.post("/api/leases-with-funding", async (req, res) => {
    try {
      const { lease: leaseData, funders: fundersData } = req.body;
      
      // Validate lease data
      const validatedLease = insertLeaseSchema.parse(leaseData);
      
      // Create the lease
      const lease = await storage.createLease(validatedLease);
      
      // Create lease funders if provided
      if (fundersData && Array.isArray(fundersData)) {
        for (const funderData of fundersData) {
          const validatedLeaseFunder = insertLeaseFunderSchema.parse({
            leaseId: lease.id,
            funderId: funderData.funderId,
            amount: funderData.amount
          });
          await storage.createLeaseFunder(validatedLeaseFunder);
        }
      }
      
      // Generate revenue events for each month and each funder
      if (fundersData && Array.isArray(fundersData)) {
        const startDate = new Date(validatedLease.startDate);
        const endDate = new Date(validatedLease.endDate);
        
        // Get all months between start and end dates
        const months = [];
        const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const last = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        
        while (current <= last) {
          months.push(new Date(current));
          current.setMonth(current.getMonth() + 1);
        }
        
        // Create revenue events for each month and each funder
        for (const month of months) {
          for (const funderData of fundersData) {
            const revenueEvent = {
              leaseId: lease.id,
              funderId: funderData.funderId,
              amount: funderData.amount,
              eventDate: month,
              month: `${month.getFullYear()}-${(month.getMonth() + 1).toString().padStart(2, '0')}`
            };
            
            const validatedRevenueEvent = insertRevenueEventSchema.parse(revenueEvent);
            await storage.createRevenueEvent(validatedRevenueEvent);
          }
        }
      }
      
      res.status(201).json({ lease, message: "Lease created with funding and revenue events" });
    } catch (error) {
      console.error("Error creating lease with funding:", error);
      res.status(400).json({ message: "Failed to create lease with funding" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
