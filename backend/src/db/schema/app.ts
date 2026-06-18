import { integer, numeric, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const storeSuppliers = pgTable('store_suppliers', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeUserId: text('store_user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  supplierUserId: text('supplier_user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('store_suppliers_store_supplier_unique').on(table.storeUserId, table.supplierUserId),
]);

export const consignedProducts = pgTable('consigned_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeUserId: text('store_user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  supplierUserId: text('supplier_user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  sellPrice: numeric('sell_price', { precision: 12, scale: 2 }).notNull(),
  supplierPrice: numeric('supplier_price', { precision: 12, scale: 2 }).notNull(),
  initialQuantity: integer('initial_quantity').default(0).notNull(),
  currentStock: integer('current_stock').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const salesTransactions = pgTable('sales_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull(),
  storeUserId: text('store_user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  status: text('status').default('Selesai').notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).default('0').notNull(),
  supplierAmount: numeric('supplier_amount', { precision: 12, scale: 2 }).default('0').notNull(),
  storeAmount: numeric('store_amount', { precision: 12, scale: 2 }).default('0').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('sales_transactions_code_unique').on(table.code),
]);

export const salesTransactionItems = pgTable('sales_transaction_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  transactionId: uuid('transaction_id').references(() => salesTransactions.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => consignedProducts.id, { onDelete: 'restrict' }).notNull(),
  supplierUserId: text('supplier_user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  productName: text('product_name').notNull(),
  supplierName: text('supplier_name').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  supplierUnitPrice: numeric('supplier_unit_price', { precision: 12, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 12, scale: 2 }).notNull(),
  supplierTotal: numeric('supplier_total', { precision: 12, scale: 2 }).notNull(),
  storeTotal: numeric('store_total', { precision: 12, scale: 2 }).notNull(),
});

export const supplierPayouts = pgTable('supplier_payouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeUserId: text('store_user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  supplierUserId: text('supplier_user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const consignmentHistory = pgTable('consignment_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeUserId: text('store_user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  supplierUserId: text('supplier_user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => consignedProducts.id, { onDelete: 'set null' }),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  sellPrice: numeric('sell_price', { precision: 12, scale: 2 }).notNull(),
  supplierPrice: numeric('supplier_price', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const stockAdditionHistory = pgTable('stock_addition_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeUserId: text('store_user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  supplierUserId: text('supplier_user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => consignedProducts.id, { onDelete: 'set null' }),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  previousStock: integer('previous_stock').notNull(),
  newStock: integer('new_stock').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
