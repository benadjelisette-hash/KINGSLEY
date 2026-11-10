import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 1. Users table (linked to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('agriculteur').notNull(), // 'agriculteur' | 'conseiller' | 'cooperative'
  phone: text('phone'),
  region: text('region').default('Abidjan'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Parcelles (Exploitations & Parcelles agricoles)
export const parcelles = pgTable('parcelles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  userUid: text('user_uid').notNull(),
  name: text('name').notNull(),
  cropType: text('crop_type').notNull(), // Cacao, Café, Anacarde, Palmier, Hévéa, Maïs, etc.
  areaHectares: text('area_hectares').notNull(),
  location: text('location').notNull(), // e.g. Divo, San-Pédro, Yamoussoukro
  soilType: text('soil_type'),
  plantingDate: text('planting_date'),
  status: text('status').default('active').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Harvests (Suivi des récoltes et rendements)
export const harvests = pgTable('harvests', {
  id: serial('id').primaryKey(),
  parcelleId: integer('parcelle_id')
    .references(() => parcelles.id, { onDelete: 'cascade' })
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  cropType: text('crop_type').notNull(),
  quantityKg: integer('quantity_kg').notNull(),
  qualityGrade: text('quality_grade').default('Standard'),
  salePriceFcfa: integer('sale_price_fcfa'),
  harvestDate: text('harvest_date').notNull(), // YYYY-MM-DD
  buyer: text('buyer'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Consultations (Demandes de diagnostic et conseil agronomique)
export const consultations = pgTable('consultations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  parcelleId: integer('parcelle_id')
    .references(() => parcelles.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  category: text('category').notNull(), // Maladie / Ravageur, Fertilisation, Traitement Phyto, etc.
  cropType: text('crop_type').notNull(),
  urgency: text('urgency').default('normale').notNull(), // faible, normale, urgente
  description: text('description').notNull(),
  status: text('status').default('en_attente').notNull(), // en_attente, en_cours, resolu
  advisorResponse: text('advisor_response'),
  advisorName: text('advisor_name'),
  createdAt: timestamp('created_at').defaultNow(),
  resolvedAt: timestamp('resolved_at'),
});

// 5. Market Prices (Cours et mercuriales officielles)
export const marketPrices = pgTable('market_prices', {
  id: serial('id').primaryKey(),
  cropType: text('crop_type').notNull(),
  variety: text('variety'),
  marketLocation: text('market_location').notNull(),
  minPriceFcfa: integer('min_price_fcfa').notNull(),
  maxPriceFcfa: integer('max_price_fcfa').notNull(),
  guaranteedPriceFcfa: integer('guaranteed_price_fcfa'),
  unit: text('unit').default('kg').notNull(),
  trend: text('trend').default('stable').notNull(), // hausse, baisse, stable
  date: text('date').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 6. Agricultural Guides (Fiches techniques & bonnes pratiques)
export const agriculturalGuides = pgTable('agricultural_guides', {
  id: serial('id').primaryKey(),
  cropType: text('crop_type').notNull(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  calendarPeriod: text('calendar_period').notNull(),
  summary: text('summary').notNull(),
  keyRecommendations: text('key_recommendations').notNull(),
  commonPests: text('common_pests'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  parcelles: many(parcelles),
  harvests: many(harvests),
  consultations: many(consultations),
}));

export const parcellesRelations = relations(parcelles, ({ one, many }) => ({
  user: one(users, {
    fields: [parcelles.userId],
    references: [users.id],
  }),
  harvests: many(harvests),
  consultations: many(consultations),
}));

export const harvestsRelations = relations(harvests, ({ one }) => ({
  parcelle: one(parcelles, {
    fields: [harvests.parcelleId],
    references: [parcelles.id],
  }),
  user: one(users, {
    fields: [harvests.userId],
    references: [users.id],
  }),
}));

export const consultationsRelations = relations(consultations, ({ one }) => ({
  user: one(users, {
    fields: [consultations.userId],
    references: [users.id],
  }),
  parcelle: one(parcelles, {
    fields: [consultations.parcelleId],
    references: [parcelles.id],
  }),
}));
