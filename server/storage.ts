import { 
  users, sites, spaceTypes, spaces, residents, leases, funders, leaseFunders, revenueEvents,
  serviceRequests, serviceOrders, workOrders, serviceRequestServiceOrders, serviceRequestWorkOrders,
  type User, type InsertUser,
  type Site, type InsertSite,
  type SpaceType, type InsertSpaceType,
  type Space, type InsertSpace,
  type Resident, type InsertResident,
  type Lease, type InsertLease,
  type Funder, type InsertFunder,
  type LeaseFunder, type InsertLeaseFunder,
  type RevenueEvent, type InsertRevenueEvent,
  type ServiceRequest, type InsertServiceRequest,
  type ServiceOrder, type InsertServiceOrder,
  type WorkOrder, type InsertWorkOrder,
  type ServiceRequestServiceOrder, type InsertServiceRequestServiceOrder,
  type ServiceRequestWorkOrder, type InsertServiceRequestWorkOrder
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session, { Store } from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Site methods
  getSites(): Promise<Site[]>;
  getSite(id: string): Promise<Site | undefined>;
  createSite(site: InsertSite): Promise<Site>;
  updateSite(id: string, site: Partial<InsertSite>): Promise<Site>;
  deleteSite(id: string): Promise<void>;
  
  // Space Type methods
  getSpaceTypes(): Promise<SpaceType[]>;
  getSpaceType(id: string): Promise<SpaceType | undefined>;
  createSpaceType(spaceType: InsertSpaceType): Promise<SpaceType>;
  
  // Space methods
  getSpaces(): Promise<Space[]>;
  getSpacesBySite(siteId: string): Promise<Space[]>;
  createSpace(space: InsertSpace): Promise<Space>;
  
  // Resident methods
  getResidents(): Promise<Resident[]>;
  getResident(id: string): Promise<Resident | undefined>;
  createResident(resident: InsertResident): Promise<Resident>;
  
  // Lease methods
  getLeases(): Promise<Lease[]>;
  getLease(id: string): Promise<Lease | undefined>;
  createLease(lease: InsertLease): Promise<Lease>;
  updateLease(id: string, lease: Partial<InsertLease>): Promise<Lease>;
  
  // Funder methods
  getFunders(): Promise<Funder[]>;
  getFunder(id: string): Promise<Funder | undefined>;
  createFunder(funder: InsertFunder): Promise<Funder>;
  
  // Lease Funder methods
  getLeaseFunders(leaseId: string): Promise<LeaseFunder[]>;
  createLeaseFunder(leaseFunder: InsertLeaseFunder): Promise<LeaseFunder>;
  deleteLeaseFundersByLeaseId(leaseId: string): Promise<void>;
  
  // Revenue Event methods
  getRevenueEvents(): Promise<RevenueEvent[]>;
  getRevenueEventsByLease(leaseId: string): Promise<RevenueEvent[]>;
  createRevenueEvent(revenueEvent: InsertRevenueEvent): Promise<RevenueEvent>;
  deleteRevenueEventsByLeaseId(leaseId: string): Promise<void>;
  
  // Service Request methods
  getServiceRequests(): Promise<ServiceRequest[]>;
  getServiceRequest(id: string): Promise<ServiceRequest | undefined>;
  getServiceRequestsByResident(residentId: string): Promise<ServiceRequest[]>;
  getServiceRequestsBySpace(spaceId: string): Promise<ServiceRequest[]>;
  getServiceRequestsByStatus(status: string): Promise<ServiceRequest[]>;
  createServiceRequest(serviceRequest: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequest(id: string, serviceRequest: Partial<InsertServiceRequest>): Promise<ServiceRequest>;
  
  // Service Order methods
  getServiceOrders(): Promise<ServiceOrder[]>;
  getServiceOrder(id: string): Promise<ServiceOrder | undefined>;
  getServiceOrdersByAssignedStaff(staffId: string): Promise<ServiceOrder[]>;
  getServiceOrdersByStatus(status: string): Promise<ServiceOrder[]>;
  createServiceOrder(serviceOrder: InsertServiceOrder): Promise<ServiceOrder>;
  updateServiceOrder(id: string, serviceOrder: Partial<InsertServiceOrder>): Promise<ServiceOrder>;
  
  // Work Order methods
  getWorkOrders(): Promise<WorkOrder[]>;
  getWorkOrder(id: string): Promise<WorkOrder | undefined>;
  getWorkOrdersByStatus(status: string): Promise<WorkOrder[]>;
  createWorkOrder(workOrder: InsertWorkOrder): Promise<WorkOrder>;
  updateWorkOrder(id: string, workOrder: Partial<InsertWorkOrder>): Promise<WorkOrder>;
  
  // Service Request to Service Order junction methods
  linkServiceRequestToServiceOrder(serviceRequestId: string, serviceOrderId: string): Promise<ServiceRequestServiceOrder>;
  getServiceOrdersForRequest(serviceRequestId: string): Promise<ServiceOrder[]>;
  getServiceRequestsForServiceOrder(serviceOrderId: string): Promise<ServiceRequest[]>;
  
  // Service Request to Work Order junction methods
  linkServiceRequestToWorkOrder(serviceRequestId: string, workOrderId: string): Promise<ServiceRequestWorkOrder>;
  getWorkOrdersForRequest(serviceRequestId: string): Promise<WorkOrder[]>;
  getServiceRequestsForWorkOrder(workOrderId: string): Promise<ServiceRequest[]>;
  
  sessionStore: Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

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

  async getSites(): Promise<Site[]> {
    return await db.select().from(sites);
  }

  async getSite(id: string): Promise<Site | undefined> {
    const [site] = await db.select().from(sites).where(eq(sites.id, id));
    return site || undefined;
  }

  async createSite(insertSite: InsertSite): Promise<Site> {
    // Convert string dates to Date objects for database insertion
    const dbInsertData = {
      ...insertSite,
      propertyDateAcquired: insertSite.propertyDateAcquired ? new Date(insertSite.propertyDateAcquired) : null,
    };
    
    const [site] = await db
      .insert(sites)
      .values(dbInsertData)
      .returning();
    return site;
  }

  async updateSite(id: string, updateData: Partial<InsertSite>): Promise<Site> {
    // Convert string dates to Date objects for database update
    const dbUpdateData = {
      ...updateData,
      propertyDateAcquired: updateData.propertyDateAcquired ? new Date(updateData.propertyDateAcquired) : undefined,
    };
    
    const [site] = await db
      .update(sites)
      .set(dbUpdateData)
      .where(eq(sites.id, id))
      .returning();
    return site;
  }

  async deleteSite(id: string): Promise<void> {
    await db.delete(sites).where(eq(sites.id, id));
  }

  async getSpaceTypes(): Promise<SpaceType[]> {
    return await db.select().from(spaceTypes);
  }

  async getSpaceType(id: string): Promise<SpaceType | undefined> {
    const [spaceType] = await db.select().from(spaceTypes).where(eq(spaceTypes.id, id));
    return spaceType || undefined;
  }

  async createSpaceType(insertSpaceType: InsertSpaceType): Promise<SpaceType> {
    const [spaceType] = await db
      .insert(spaceTypes)
      .values(insertSpaceType)
      .returning();
    return spaceType;
  }

  async getSpaces(): Promise<Space[]> {
    return await db.select().from(spaces);
  }

  async getSpacesBySite(siteId: string): Promise<Space[]> {
    return await db.select().from(spaces).where(eq(spaces.siteId, siteId));
  }

  async createSpace(insertSpace: InsertSpace): Promise<Space> {
    const [space] = await db
      .insert(spaces)
      .values(insertSpace)
      .returning();
    return space;
  }

  async getResidents(): Promise<Resident[]> {
    return await db.select().from(residents);
  }

  async getResident(id: string): Promise<Resident | undefined> {
    const [resident] = await db.select().from(residents).where(eq(residents.id, id));
    return resident || undefined;
  }

  async createResident(insertResident: InsertResident): Promise<Resident> {
    const [resident] = await db
      .insert(residents)
      .values(insertResident)
      .returning();
    return resident;
  }

  async getLeases(): Promise<Lease[]> {
    return await db.select().from(leases);
  }

  async getLease(id: string): Promise<Lease | undefined> {
    const [lease] = await db.select().from(leases).where(eq(leases.id, id));
    return lease || undefined;
  }

  async createLease(insertLease: InsertLease): Promise<Lease> {
    const [lease] = await db
      .insert(leases)
      .values(insertLease)
      .returning();
    return lease;
  }

  async updateLease(id: string, updateData: Partial<InsertLease>): Promise<Lease> {
    const [lease] = await db
      .update(leases)
      .set(updateData)
      .where(eq(leases.id, id))
      .returning();
    return lease;
  }

  async getFunders(): Promise<Funder[]> {
    return await db.select().from(funders);
  }

  async getFunder(id: string): Promise<Funder | undefined> {
    const [funder] = await db.select().from(funders).where(eq(funders.id, id));
    return funder || undefined;
  }

  async createFunder(insertFunder: InsertFunder): Promise<Funder> {
    const [funder] = await db
      .insert(funders)
      .values(insertFunder)
      .returning();
    return funder;
  }

  async getLeaseFunders(leaseId: string): Promise<LeaseFunder[]> {
    return await db.select().from(leaseFunders).where(eq(leaseFunders.leaseId, leaseId));
  }

  async createLeaseFunder(insertLeaseFunder: InsertLeaseFunder): Promise<LeaseFunder> {
    const [leaseFunder] = await db
      .insert(leaseFunders)
      .values(insertLeaseFunder)
      .returning();
    return leaseFunder;
  }

  async deleteLeaseFundersByLeaseId(leaseId: string): Promise<void> {
    await db.delete(leaseFunders).where(eq(leaseFunders.leaseId, leaseId));
  }

  async getRevenueEvents(): Promise<RevenueEvent[]> {
    return await db.select().from(revenueEvents);
  }

  async getRevenueEventsByLease(leaseId: string): Promise<RevenueEvent[]> {
    return await db.select().from(revenueEvents).where(eq(revenueEvents.leaseId, leaseId));
  }

  async createRevenueEvent(insertRevenueEvent: InsertRevenueEvent): Promise<RevenueEvent> {
    const [revenueEvent] = await db
      .insert(revenueEvents)
      .values(insertRevenueEvent)
      .returning();
    return revenueEvent;
  }

  async deleteRevenueEventsByLeaseId(leaseId: string): Promise<void> {
    await db.delete(revenueEvents).where(eq(revenueEvents.leaseId, leaseId));
  }

  // Service Request methods
  async getServiceRequests(): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests);
  }

  async getServiceRequest(id: string): Promise<ServiceRequest | undefined> {
    const [serviceRequest] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id));
    return serviceRequest || undefined;
  }

  async getServiceRequestsByResident(residentId: string): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests).where(eq(serviceRequests.residentId, residentId));
  }

  async getServiceRequestsBySpace(spaceId: string): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests).where(eq(serviceRequests.spaceId, spaceId));
  }

  async getServiceRequestsByStatus(status: string): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests).where(eq(serviceRequests.status, status as any));
  }

  async createServiceRequest(insertServiceRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const [serviceRequest] = await db
      .insert(serviceRequests)
      .values(insertServiceRequest)
      .returning();
    return serviceRequest;
  }

  async updateServiceRequest(id: string, updateData: Partial<InsertServiceRequest>): Promise<ServiceRequest> {
    const [serviceRequest] = await db
      .update(serviceRequests)
      .set(updateData)
      .where(eq(serviceRequests.id, id))
      .returning();
    return serviceRequest;
  }

  // Service Order methods
  async getServiceOrders(): Promise<ServiceOrder[]> {
    return await db.select().from(serviceOrders);
  }

  async getServiceOrder(id: string): Promise<ServiceOrder | undefined> {
    const [serviceOrder] = await db.select().from(serviceOrders).where(eq(serviceOrders.id, id));
    return serviceOrder || undefined;
  }

  async getServiceOrdersByAssignedStaff(staffId: string): Promise<ServiceOrder[]> {
    return await db.select().from(serviceOrders).where(eq(serviceOrders.assignedStaffId, staffId));
  }

  async getServiceOrdersByStatus(status: string): Promise<ServiceOrder[]> {
    return await db.select().from(serviceOrders).where(eq(serviceOrders.status, status as any));
  }

  async createServiceOrder(insertServiceOrder: InsertServiceOrder): Promise<ServiceOrder> {
    const [serviceOrder] = await db
      .insert(serviceOrders)
      .values(insertServiceOrder)
      .returning();
    return serviceOrder;
  }

  async updateServiceOrder(id: string, updateData: Partial<InsertServiceOrder>): Promise<ServiceOrder> {
    const [serviceOrder] = await db
      .update(serviceOrders)
      .set(updateData)
      .where(eq(serviceOrders.id, id))
      .returning();
    return serviceOrder;
  }

  // Work Order methods
  async getWorkOrders(): Promise<WorkOrder[]> {
    return await db.select().from(workOrders);
  }

  async getWorkOrder(id: string): Promise<WorkOrder | undefined> {
    const [workOrder] = await db.select().from(workOrders).where(eq(workOrders.id, id));
    return workOrder || undefined;
  }

  async getWorkOrdersByStatus(status: string): Promise<WorkOrder[]> {
    return await db.select().from(workOrders).where(eq(workOrders.status, status as any));
  }

  async createWorkOrder(insertWorkOrder: InsertWorkOrder): Promise<WorkOrder> {
    const [workOrder] = await db
      .insert(workOrders)
      .values(insertWorkOrder)
      .returning();
    return workOrder;
  }

  async updateWorkOrder(id: string, updateData: Partial<InsertWorkOrder>): Promise<WorkOrder> {
    const [workOrder] = await db
      .update(workOrders)
      .set(updateData)
      .where(eq(workOrders.id, id))
      .returning();
    return workOrder;
  }

  // Service Request to Service Order junction methods
  async linkServiceRequestToServiceOrder(serviceRequestId: string, serviceOrderId: string): Promise<ServiceRequestServiceOrder> {
    const [link] = await db
      .insert(serviceRequestServiceOrders)
      .values({ serviceRequestId, serviceOrderId })
      .returning();
    return link;
  }

  async getServiceOrdersForRequest(serviceRequestId: string): Promise<ServiceOrder[]> {
    const result = await db
      .select({ serviceOrder: serviceOrders })
      .from(serviceRequestServiceOrders)
      .innerJoin(serviceOrders, eq(serviceRequestServiceOrders.serviceOrderId, serviceOrders.id))
      .where(eq(serviceRequestServiceOrders.serviceRequestId, serviceRequestId));
    return result.map(row => row.serviceOrder);
  }

  async getServiceRequestsForServiceOrder(serviceOrderId: string): Promise<ServiceRequest[]> {
    const result = await db
      .select({ serviceRequest: serviceRequests })
      .from(serviceRequestServiceOrders)
      .innerJoin(serviceRequests, eq(serviceRequestServiceOrders.serviceRequestId, serviceRequests.id))
      .where(eq(serviceRequestServiceOrders.serviceOrderId, serviceOrderId));
    return result.map(row => row.serviceRequest);
  }

  // Service Request to Work Order junction methods
  async linkServiceRequestToWorkOrder(serviceRequestId: string, workOrderId: string): Promise<ServiceRequestWorkOrder> {
    const [link] = await db
      .insert(serviceRequestWorkOrders)
      .values({ serviceRequestId, workOrderId })
      .returning();
    return link;
  }

  async getWorkOrdersForRequest(serviceRequestId: string): Promise<WorkOrder[]> {
    const result = await db
      .select({ workOrder: workOrders })
      .from(serviceRequestWorkOrders)
      .innerJoin(workOrders, eq(serviceRequestWorkOrders.workOrderId, workOrders.id))
      .where(eq(serviceRequestWorkOrders.serviceRequestId, serviceRequestId));
    return result.map(row => row.workOrder);
  }

  async getServiceRequestsForWorkOrder(workOrderId: string): Promise<ServiceRequest[]> {
    const result = await db
      .select({ serviceRequest: serviceRequests })
      .from(serviceRequestWorkOrders)
      .innerJoin(serviceRequests, eq(serviceRequestWorkOrders.serviceRequestId, serviceRequests.id))
      .where(eq(serviceRequestWorkOrders.workOrderId, workOrderId));
    return result.map(row => row.serviceRequest);
  }
}

export const storage = new DatabaseStorage();
