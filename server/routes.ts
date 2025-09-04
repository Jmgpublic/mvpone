import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertSiteSchema, insertSpaceTypeSchema, insertSpaceSchema, insertResidentSchema, insertLeaseSchema, insertFunderSchema, insertLeaseFunderSchema, insertRevenueEventSchema, insertServiceRequestSchema, insertServiceOrderSchema, insertWorkOrderSchema } from "@shared/schema";

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

  app.get("/api/sites/:id", async (req, res) => {
    try {
      const site = await storage.getSite(req.params.id);
      if (!site) {
        return res.status(404).json({ message: "Site not found" });
      }
      res.json(site);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site" });
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

  app.put("/api/sites/:id", async (req, res) => {
    try {
      const validatedData = insertSiteSchema.partial().parse(req.body);
      const site = await storage.updateSite(req.params.id, validatedData);
      res.json(site);
    } catch (error) {
      res.status(400).json({ message: "Invalid site data" });
    }
  });

  app.delete("/api/sites/:id", async (req, res) => {
    try {
      await storage.deleteSite(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete site" });
    }
  });

  // Space Types routes
  app.get("/api/space-types", async (req, res) => {
    try {
      const spaceTypes = await storage.getSpaceTypes();
      res.json(spaceTypes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch space types" });
    }
  });

  app.post("/api/space-types", async (req, res) => {
    try {
      const validatedData = insertSpaceTypeSchema.parse(req.body);
      const spaceType = await storage.createSpaceType(validatedData);
      res.status(201).json(spaceType);
    } catch (error) {
      res.status(400).json({ message: "Invalid space type data" });
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
      console.log("Received space data:", req.body);
      const validatedData = insertSpaceSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      const space = await storage.createSpace(validatedData);
      res.status(201).json(space);
    } catch (error) {
      console.error("Space creation error:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: "Invalid space data", details: error.message });
      } else {
        res.status(400).json({ message: "Invalid space data" });
      }
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

  // Service Request routes
  app.get("/api/service-requests", async (req, res) => {
    try {
      const { residentId, spaceId, status } = req.query;
      let serviceRequests;
      
      if (residentId) {
        serviceRequests = await storage.getServiceRequestsByResident(residentId as string);
      } else if (spaceId) {
        serviceRequests = await storage.getServiceRequestsBySpace(spaceId as string);
      } else if (status) {
        serviceRequests = await storage.getServiceRequestsByStatus(status as string);
      } else {
        serviceRequests = await storage.getServiceRequests();
      }
      
      res.json(serviceRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service requests" });
    }
  });

  app.get("/api/service-requests/:id", async (req, res) => {
    try {
      const serviceRequest = await storage.getServiceRequest(req.params.id);
      if (!serviceRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(serviceRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service request" });
    }
  });

  app.post("/api/service-requests", async (req, res) => {
    try {
      const validatedData = insertServiceRequestSchema.parse(req.body);
      const serviceRequest = await storage.createServiceRequest(validatedData);
      res.status(201).json(serviceRequest);
    } catch (error) {
      res.status(400).json({ message: "Invalid service request data" });
    }
  });

  app.put("/api/service-requests/:id", async (req, res) => {
    try {
      const validatedData = insertServiceRequestSchema.partial().parse(req.body);
      const serviceRequest = await storage.updateServiceRequest(req.params.id, validatedData);
      res.json(serviceRequest);
    } catch (error) {
      res.status(400).json({ message: "Invalid service request data" });
    }
  });

  // Service Order routes
  app.get("/api/service-orders", async (req, res) => {
    try {
      const { assignedStaffId, status } = req.query;
      let serviceOrders;
      
      if (assignedStaffId) {
        serviceOrders = await storage.getServiceOrdersByAssignedStaff(assignedStaffId as string);
      } else if (status) {
        serviceOrders = await storage.getServiceOrdersByStatus(status as string);
      } else {
        serviceOrders = await storage.getServiceOrders();
      }
      
      res.json(serviceOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service orders" });
    }
  });

  app.get("/api/service-orders/:id", async (req, res) => {
    try {
      const serviceOrder = await storage.getServiceOrder(req.params.id);
      if (!serviceOrder) {
        return res.status(404).json({ message: "Service order not found" });
      }
      res.json(serviceOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service order" });
    }
  });

  app.post("/api/service-orders", async (req, res) => {
    try {
      const validatedData = insertServiceOrderSchema.parse(req.body);
      const serviceOrder = await storage.createServiceOrder(validatedData);
      res.status(201).json(serviceOrder);
    } catch (error) {
      res.status(400).json({ message: "Invalid service order data" });
    }
  });

  app.put("/api/service-orders/:id", async (req, res) => {
    try {
      const validatedData = insertServiceOrderSchema.partial().parse(req.body);
      const serviceOrder = await storage.updateServiceOrder(req.params.id, validatedData);
      res.json(serviceOrder);
    } catch (error) {
      res.status(400).json({ message: "Invalid service order data" });
    }
  });

  // Work Order routes
  app.get("/api/work-orders", async (req, res) => {
    try {
      const { status } = req.query;
      let workOrders;
      
      if (status) {
        workOrders = await storage.getWorkOrdersByStatus(status as string);
      } else {
        workOrders = await storage.getWorkOrders();
      }
      
      res.json(workOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch work orders" });
    }
  });

  app.get("/api/work-orders/:id", async (req, res) => {
    try {
      const workOrder = await storage.getWorkOrder(req.params.id);
      if (!workOrder) {
        return res.status(404).json({ message: "Work order not found" });
      }
      res.json(workOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch work order" });
    }
  });

  app.post("/api/work-orders", async (req, res) => {
    try {
      const validatedData = insertWorkOrderSchema.parse(req.body);
      const workOrder = await storage.createWorkOrder(validatedData);
      res.status(201).json(workOrder);
    } catch (error) {
      res.status(400).json({ message: "Invalid work order data" });
    }
  });

  app.put("/api/work-orders/:id", async (req, res) => {
    try {
      const validatedData = insertWorkOrderSchema.partial().parse(req.body);
      const workOrder = await storage.updateWorkOrder(req.params.id, validatedData);
      res.json(workOrder);
    } catch (error) {
      res.status(400).json({ message: "Invalid work order data" });
    }
  });

  // Service Request to Order linking routes
  app.post("/api/service-requests/:serviceRequestId/service-orders/:serviceOrderId", async (req, res) => {
    try {
      const link = await storage.linkServiceRequestToServiceOrder(req.params.serviceRequestId, req.params.serviceOrderId);
      res.status(201).json(link);
    } catch (error) {
      res.status(400).json({ message: "Failed to link service request to service order" });
    }
  });

  app.post("/api/service-requests/:serviceRequestId/work-orders/:workOrderId", async (req, res) => {
    try {
      const link = await storage.linkServiceRequestToWorkOrder(req.params.serviceRequestId, req.params.workOrderId);
      res.status(201).json(link);
    } catch (error) {
      res.status(400).json({ message: "Failed to link service request to work order" });
    }
  });

  app.get("/api/service-requests/:id/service-orders", async (req, res) => {
    try {
      const serviceOrders = await storage.getServiceOrdersForRequest(req.params.id);
      res.json(serviceOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service orders for request" });
    }
  });

  app.get("/api/service-requests/:id/work-orders", async (req, res) => {
    try {
      const workOrders = await storage.getWorkOrdersForRequest(req.params.id);
      res.json(workOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch work orders for request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
