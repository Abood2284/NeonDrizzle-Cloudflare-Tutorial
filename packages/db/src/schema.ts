import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
});


export type InsertProduct = typeof products.$inferInsert;
export type SelectProduct = typeof products.$inferSelect;
