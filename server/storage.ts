import { 
  users, sites, spaces, residents, leases, funders, leaseFunders, revenueEvents,
  type User, type InsertUser,
  type Site, type InsertSite,
  type Space, type InsertSpace,
  type Resident, type InsertResident,
  type Lease, type InsertLease,
  type Funder, type InsertFunder,
  type LeaseFunder, type InsertLeaseFunder,
  type RevenueEvent, type InsertRevenueEvent
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
    const [site] = await db
      .insert(sites)
      .values(insertSite)
      .returning();
    return site;
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
}

export const storage = new DatabaseStorage();
