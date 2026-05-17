/**
 * Datenbankschema – KI-Energie-Marktanalyse
 * Tabellen: market_stats, market_growth, use_cases, pestel_factors,
 *           swot_items, porter_forces, competitors, documents
 */

import {
  boolean,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Marktstatistiken (KPIs) ──────────────────────────────────────────────────
export const marketStats = mysqlTable("market_stats", {
  id: int("id").primaryKey().autoincrement(),
  label: varchar("label", { length: 100 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  sub: varchar("sub", { length: 200 }).notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ─── Marktentwicklungsdaten (Zeitreihe) ───────────────────────────────────────
export const marketGrowth = mysqlTable("market_growth", {
  id: int("id").primaryKey().autoincrement(),
  year: varchar("year", { length: 10 }).notNull(),
  value: int("value").notNull(), // USD Mio.
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Anwendungsfelder (Use Cases) ─────────────────────────────────────────────
export const useCases = mysqlTable("use_cases", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 200 }).notNull(),
  value: int("value").notNull(), // Prozent
  color: varchar("color", { length: 20 }).notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── PESTEL-Faktoren ──────────────────────────────────────────────────────────
export const pestelFactors = mysqlTable("pestel_factors", {
  id: int("id").primaryKey().autoincrement(),
  dimension: varchar("dimension", { length: 20 }).notNull(), // political, economic, ...
  dimensionLabel: varchar("dimension_label", { length: 50 }).notNull(),
  dimensionIcon: varchar("dimension_icon", { length: 10 }).notNull(),
  dimensionColor: varchar("dimension_color", { length: 20 }).notNull(),
  dimensionRating: int("dimension_rating").notNull(), // 1-5
  dimensionSummary: text("dimension_summary").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  impact: varchar("impact", { length: 20 }).notNull(), // positiv, negativ, gemischt
  description: text("description").notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ─── SWOT-Einträge ────────────────────────────────────────────────────────────
export const swotItems = mysqlTable("swot_items", {
  id: int("id").primaryKey().autoincrement(),
  quadrant: varchar("quadrant", { length: 20 }).notNull(), // strengths, weaknesses, opportunities, threats
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ─── Porter's Five Forces ─────────────────────────────────────────────────────
export const porterForces = mysqlTable("porter_forces", {
  id: int("id").primaryKey().autoincrement(),
  force: varchar("force", { length: 200 }).notNull(),
  level: varchar("level", { length: 50 }).notNull(), // Niedrig, Mittel, Hoch
  score: int("score").notNull(), // 1-5
  color: varchar("color", { length: 20 }).notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  description: text("description").notNull(),
  factors: json("factors").notNull(), // Array of {name, impact, direction}
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ─── Wettbewerber ─────────────────────────────────────────────────────────────
export const competitors = mysqlTable("competitors", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  focus: varchar("focus", { length: 200 }).notNull(),
  strength: int("strength").notNull(), // 0-100
  color: varchar("color", { length: 20 }).notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ─── Dokumente / Datei-Uploads ────────────────────────────────────────────────
export const documents = mysqlTable("documents", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  size: int("size").notNull(), // Bytes
  storageKey: varchar("storage_key", { length: 500 }).notNull(), // S3 key
  storageUrl: varchar("storage_url", { length: 1000 }), // Public/presigned URL
  category: varchar("category", { length: 100 }).default("general"), // general, pestel, swot, porter, strategy
  description: text("description"),
  uploadedBy: varchar("uploaded_by", { length: 100 }).default("anonymous"),
  isPublic: boolean("is_public").default(true),
  downloadCount: int("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ─── Strategische Empfehlungen ────────────────────────────────────────────────
export const strategicRecommendations = mysqlTable("strategic_recommendations", {
  id: int("id").primaryKey().autoincrement(),
  priority: varchar("priority", { length: 20 }).notNull(), // Hoch, Mittel, Niedrig
  timeframe: varchar("timeframe", { length: 50 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
