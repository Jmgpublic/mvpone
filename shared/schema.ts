import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'property_manager', 'facility_manager', 'resident', 'security', 'case_manager']);
export const residentTypeEnum = pgEnum('resident_type', ['primary_tenant', 'co_tenant', 'authorized_occupant']);
export const residentRoleEnum = pgEnum('resident_role', ['leaseholder', 'emergency_contact', 'guarantor']);
export const serviceRequestStatusEnum = pgEnum('service_request_status', ['submitted', 'acknowledged', 'triaged', 'in_progress', 'resolved', 'closed']);
export const serviceRequestPriorityEnum = pgEnum('service_request_priority', ['low', 'medium', 'high', 'urgent']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'in_progress', 'completed', 'cancelled']);

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
  propertyNickname: text("property_nickname"),
  propertyDescription: text("property_description"),
  propertyDateAcquired: timestamp("property_date_acquired"),
  propertyValueAssessed: decimal("property_value_assessed", { precision: 10, scale: 2 }),
  propertyValueMortgageTotal: decimal("property_value_mortgage_total", { precision: 10, scale: 2 }),
  mortgagePaymentPrincipal: decimal("mortgage_payment_principal", { precision: 10, scale: 2 }),
  mortgagePaymentInterest: decimal("mortgage_payment_interest", { precision: 10, scale: 2 }),
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

// Service Requests table
export const serviceRequests = pgTable("service_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: serviceRequestPriorityEnum("priority").notNull().default('medium'),
  status: serviceRequestStatusEnum("status").notNull().default('submitted'),
  residentId: varchar("resident_id").notNull().references(() => residents.id),
  spaceId: varchar("space_id").notNull().references(() => spaces.id),
  acknowledgedAt: timestamp("acknowledged_at"),
  triagedAt: timestamp("triaged_at"),
  resolvedAt: timestamp("resolved_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Service Orders table (performed by staff with material expenses)
export const serviceOrders = pgTable("service_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: orderStatusEnum("status").notNull().default('pending'),
  assignedStaffId: varchar("assigned_staff_id").references(() => users.id),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Work Orders table (performed by sub-contractors)
export const workOrders = pgTable("work_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: orderStatusEnum("status").notNull().default('pending'),
  contractorName: text("contractor_name"),
  contractorContact: text("contractor_contact"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Junction table for service requests to service orders (many-to-many)
export const serviceRequestServiceOrders = pgTable("service_request_service_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceRequestId: varchar("service_request_id").notNull().references(() => serviceRequests.id),
  serviceOrderId: varchar("service_order_id").notNull().references(() => serviceOrders.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Junction table for service requests to work orders (many-to-many)
export const serviceRequestWorkOrders = pgTable("service_request_work_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceRequestId: varchar("service_request_id").notNull().references(() => serviceRequests.id),
  workOrderId: varchar("work_order_id").notNull().references(() => workOrders.id),
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

export const usersRelations = relations(users, ({ one, many }) => ({
  resident: one(residents),
  serviceOrders: many(serviceOrders),
}));

export const serviceRequestsRelations = relations(serviceRequests, ({ one, many }) => ({
  resident: one(residents, {
    fields: [serviceRequests.residentId],
    references: [residents.id],
  }),
  space: one(spaces, {
    fields: [serviceRequests.spaceId],
    references: [spaces.id],
  }),
  serviceRequestServiceOrders: many(serviceRequestServiceOrders),
  serviceRequestWorkOrders: many(serviceRequestWorkOrders),
}));

export const serviceOrdersRelations = relations(serviceOrders, ({ one, many }) => ({
  assignedStaff: one(users, {
    fields: [serviceOrders.assignedStaffId],
    references: [users.id],
  }),
  serviceRequestServiceOrders: many(serviceRequestServiceOrders),
}));

export const workOrdersRelations = relations(workOrders, ({ many }) => ({
  serviceRequestWorkOrders: many(serviceRequestWorkOrders),
}));

export const serviceRequestServiceOrdersRelations = relations(serviceRequestServiceOrders, ({ one }) => ({
  serviceRequest: one(serviceRequests, {
    fields: [serviceRequestServiceOrders.serviceRequestId],
    references: [serviceRequests.id],
  }),
  serviceOrder: one(serviceOrders, {
    fields: [serviceRequestServiceOrders.serviceOrderId],
    references: [serviceOrders.id],
  }),
}));

export const serviceRequestWorkOrdersRelations = relations(serviceRequestWorkOrders, ({ one }) => ({
  serviceRequest: one(serviceRequests, {
    fields: [serviceRequestWorkOrders.serviceRequestId],
    references: [serviceRequests.id],
  }),
  workOrder: one(workOrders, {
    fields: [serviceRequestWorkOrders.workOrderId],
    references: [workOrders.id],
  }),
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
  propertyNickname: z.string().optional(),
  propertyDescription: z.string().optional(),
  propertyDateAcquired: z.string().optional(),
  propertyValueAssessed: z.string().optional(),
  propertyValueMortgageTotal: z.string().optional(),
  mortgagePaymentPrincipal: z.string().optional(),
  mortgagePaymentInterest: z.string().optional(),
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

export const insertServiceRequestSchema = createInsertSchema(serviceRequests).omit({
  id: true,
  createdAt: true,
});

export const insertServiceOrderSchema = createInsertSchema(serviceOrders).omit({
  id: true,
  createdAt: true,
});

export const insertWorkOrderSchema = createInsertSchema(workOrders).omit({
  id: true,
  createdAt: true,
});

export const insertServiceRequestServiceOrderSchema = createInsertSchema(serviceRequestServiceOrders).omit({
  id: true,
  createdAt: true,
});

export const insertServiceRequestWorkOrderSchema = createInsertSchema(serviceRequestWorkOrders).omit({
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
export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceOrder = typeof serviceOrders.$inferSelect;
export type InsertServiceOrder = z.infer<typeof insertServiceOrderSchema>;
export type WorkOrder = typeof workOrders.$inferSelect;
export type InsertWorkOrder = z.infer<typeof insertWorkOrderSchema>;
export type ServiceRequestServiceOrder = typeof serviceRequestServiceOrders.$inferSelect;
export type InsertServiceRequestServiceOrder = z.infer<typeof insertServiceRequestServiceOrderSchema>;
export type ServiceRequestWorkOrder = typeof serviceRequestWorkOrders.$inferSelect;
export type InsertServiceRequestWorkOrder = z.infer<typeof insertServiceRequestWorkOrderSchema>;
