import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'property_manager', 'facility_manager', 'resident', 'security', 'case_manager']);
export const residentTypeEnum = pgEnum('resident_type', ['primary_tenant', 'co_tenant', 'authorized_occupant']);
export const residentRoleEnum = pgEnum('resident_role', ['leaseholder', 'emergency_contact', 'guarantor']);
export const spaceTypeEnum = pgEnum('space_type', ['studio', '1_bedroom', '2_bedroom', '3_bedroom', 'common_area']);

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
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

// Spaces table
export const spaces = pgTable("spaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  identifier: text("identifier").notNull(),
  type: spaceTypeEnum("type").notNull(),
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
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const sitesRelations = relations(sites, ({ many }) => ({
  spaces: many(spaces),
}));

export const spacesRelations = relations(spaces, ({ one, many }) => ({
  site: one(sites, {
    fields: [spaces.siteId],
    references: [sites.id],
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

export const leasesRelations = relations(leases, ({ one }) => ({
  resident: one(residents, {
    fields: [leases.residentId],
    references: [residents.id],
  }),
  space: one(spaces, {
    fields: [leases.spaceId],
    references: [spaces.id],
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

export const insertSiteSchema = createInsertSchema(sites).omit({
  id: true,
  createdAt: true,
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

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Site = typeof sites.$inferSelect;
export type InsertSite = z.infer<typeof insertSiteSchema>;
export type Space = typeof spaces.$inferSelect;
export type InsertSpace = z.infer<typeof insertSpaceSchema>;
export type Resident = typeof residents.$inferSelect;
export type InsertResident = z.infer<typeof insertResidentSchema>;
export type Lease = typeof leases.$inferSelect;
export type InsertLease = z.infer<typeof insertLeaseSchema>;
