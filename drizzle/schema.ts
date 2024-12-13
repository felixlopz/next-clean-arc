import { pgTable, text, varchar, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const userRole = pgEnum("userRole", ["user", "admin"]);

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(), // UUID or other unique identifier
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRole().default("user").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(), // Default timestamp
});

const userInsertSchema = createInsertSchema(users)


// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(users);