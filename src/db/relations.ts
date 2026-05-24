import { relations } from "drizzle-orm";
import {
  products,
  stockMovements,
  storeMembers,
  stores,
  suppliers,
  transactionItems,
  transactions,
  users,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  stores: many(stores),
  memberships: many(storeMembers),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  owner: one(users, { fields: [stores.ownerId], references: [users.id] }),
  members: many(storeMembers),
  suppliers: many(suppliers),
  products: many(products),
  transactions: many(transactions),
  stockMovements: many(stockMovements),
}));

export const storeMembersRelations = relations(storeMembers, ({ one }) => ({
  store: one(stores, { fields: [storeMembers.storeId], references: [stores.id] }),
  user: one(users, { fields: [storeMembers.userId], references: [users.id] }),
}));

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
  store: one(stores, { fields: [suppliers.storeId], references: [stores.id] }),
  user: one(users, { fields: [suppliers.userId], references: [users.id] }),
  products: many(products),
  transactionItems: many(transactionItems),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  supplier: one(suppliers, { fields: [products.supplierId], references: [suppliers.id] }),
  stockMovements: many(stockMovements),
  transactionItems: many(transactionItems),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  store: one(stores, { fields: [stockMovements.storeId], references: [stores.id] }),
  product: one(products, { fields: [stockMovements.productId], references: [products.id] }),
  creator: one(users, { fields: [stockMovements.createdBy], references: [users.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  store: one(stores, { fields: [transactions.storeId], references: [stores.id] }),
  creator: one(users, { fields: [transactions.createdBy], references: [users.id] }),
  items: many(transactionItems),
}));

export const transactionItemsRelations = relations(transactionItems, ({ one }) => ({
  transaction: one(transactions, { fields: [transactionItems.transactionId], references: [transactions.id] }),
  product: one(products, { fields: [transactionItems.productId], references: [products.id] }),
  supplier: one(suppliers, { fields: [transactionItems.supplierId], references: [suppliers.id] }),
}));
