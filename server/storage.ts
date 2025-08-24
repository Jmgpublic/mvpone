import { 
  users, sites, spaces, residents, leases,
  type User, type InsertUser,
  type Site, type InsertSite,
  type Space, type InsertSpace,
  type Resident, type InsertResident,
  type Lease, type InsertLease
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
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
  
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

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
}

export const storage = new DatabaseStorage();
