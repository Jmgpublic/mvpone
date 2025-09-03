import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'property_manager', 'facility_manager', 'resident', 'security', 'case_manager']);
export const residentTypeEnum = pgEnum('resident_type', ['primary_tenant', 'co_tenant', 'authorized_occupant']);
export const residentRoleEnum = pgEnum('resident_role', ['leaseholder', 'emergency_contact', 'guarantor']);

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: userRoleEnum("role").notNull().default('resident'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sites table
export const sites = pgTable("sites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Space Types table
export const spaceTypes = pgTable("space_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  rentable: boolean("rentable").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Spaces table
export const spaces = pgTable("spaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  identifier: text("identifier").notNull(),
  spaceTypeId: varchar("space_type_id").notNull().references(() => spaceTypes.id),
  siteId: varchar("site_id").notNull().references(() => sites.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Residents table
export const residents = pgTable("residents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  type: residentTypeEnum("type").notNull(),
  role: residentRoleEnum("role").notNull(),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Leases table
export const leases = pgTable("leases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  residentId: varchar("resident_id").notNull().references(() => residents.id),
  spaceId: varchar("space_id").notNull().references(() => spaces.id),
  rentalAmount: decimal("rental_amount", { precision: 10, scale: 2 }).notNull(),
  marketValue: decimal("market_value", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Funders table
export const funders = pgTable("funders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Lease funders (junction table for lease funding sources)
export const leaseFunders = pgTable("lease_funders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leaseId: varchar("lease_id").notNull().references(() => leases.id),
  funderId: varchar("funder_id").notNull().references(() => funders.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Revenue events table
export const revenueEvents = pgTable("revenue_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leaseId: varchar("lease_id").notNull().references(() => leases.id),
  funderId: varchar("funder_id").notNull().references(() => funders.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  eventDate: timestamp("event_date").notNull(),
  month: text("month").notNull(), // Format: "2025-06"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const sitesRelations = relations(sites, ({ many }) => ({
  spaces: many(spaces),
}));

export const spaceTypesRelations = relations(spaceTypes, ({ many }) => ({
  spaces: many(spaces),
}));

export const spacesRelations = relations(spaces, ({ one, many }) => ({
  site: one(sites, {
    fields: [spaces.siteId],
    references: [sites.id],
  }),
  spaceType: one(spaceTypes, {
    fields: [spaces.spaceTypeId],
    references: [spaceTypes.id],
  }),
  leases: many(leases),
}));

export const residentsRelations = relations(residents, ({ one, many }) => ({
  user: one(users, {
    fields: [residents.userId],
    references: [users.id],
  }),
  leases: many(leases),
}));

export const leasesRelations = relations(leases, ({ one, many }) => ({
  resident: one(residents, {
    fields: [leases.residentId],
    references: [residents.id],
  }),
  space: one(spaces, {
    fields: [leases.spaceId],
    references: [spaces.id],
  }),
  leaseFunders: many(leaseFunders),
  revenueEvents: many(revenueEvents),
}));

export const fundersRelations = relations(funders, ({ many }) => ({
  leaseFunders: many(leaseFunders),
  revenueEvents: many(revenueEvents),
}));

export const leaseFundersRelations = relations(leaseFunders, ({ one }) => ({
  lease: one(leases, {
    fields: [leaseFunders.leaseId],
    references: [leases.id],
  }),
  funder: one(funders, {
    fields: [leaseFunders.funderId],
    references: [funders.id],
  }),
}));

export const revenueEventsRelations = relations(revenueEvents, ({ one }) => ({
  lease: one(leases, {
    fields: [revenueEvents.leaseId],
    references: [leases.id],
  }),
  funder: one(funders, {
    fields: [revenueEvents.funderId],
    references: [funders.id],
  }),
}));

export const usersRelations = relations(users, ({ one }) => ({
  resident: one(residents),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSpaceTypeSchema = createInsertSchema(spaceTypes).omit({
  id: true,
  createdAt: true,
});

export const insertSiteSchema = createInsertSchema(sites).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(1, "Site name is required"),
  address: z.string().min(1, "Address is required"),
});

export const insertSpaceSchema = createInsertSchema(spaces).omit({
  id: true,
  createdAt: true,
});

export const insertResidentSchema = createInsertSchema(residents).omit({
  id: true,
  createdAt: true,
});

export const insertLeaseSchema = createInsertSchema(leases).omit({
  id: true,
  createdAt: true,
});

export const insertFunderSchema = createInsertSchema(funders).omit({
  id: true,
  createdAt: true,
});

export const insertLeaseFunderSchema = createInsertSchema(leaseFunders).omit({
  id: true,
  createdAt: true,
});

export const insertRevenueEventSchema = createInsertSchema(revenueEvents).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Site = typeof sites.$inferSelect;
export type InsertSite = z.infer<typeof insertSiteSchema>;
export type SpaceType = typeof spaceTypes.$inferSelect;
export type InsertSpaceType = z.infer<typeof insertSpaceTypeSchema>;
export type Space = typeof spaces.$inferSelect;
export type InsertSpace = z.infer<typeof insertSpaceSchema>;
export type Resident = typeof residents.$inferSelect;
export type InsertResident = z.infer<typeof insertResidentSchema>;
export type Lease = typeof leases.$inferSelect;
export type InsertLease = z.infer<typeof insertLeaseSchema>;
export type Funder = typeof funders.$inferSelect;
export type InsertFunder = z.infer<typeof insertFunderSchema>;
export type LeaseFunder = typeof leaseFunders.$inferSelect;
export type InsertLeaseFunder = z.infer<typeof insertLeaseFunderSchema>;
export type RevenueEvent = typeof revenueEvents.$inferSelect;
export type InsertRevenueEvent = z.infer<typeof insertRevenueEventSchema>;
