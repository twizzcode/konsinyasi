import 'dotenv/config';
import { and, desc, eq, ilike, inArray, or } from 'drizzle-orm';
import { ApiRouter } from './router';
import { db } from './db';
import { consignedProducts, consignmentHistory, salesTransactionItems, salesTransactions, stockAdditionHistory, storeSuppliers, supplierPayouts, user } from './db/schema';

const app = new ApiRouter();

const createTransactionCode = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const stamp = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join('');

  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `TRX-${stamp}-${suffix}`;
};

const ensureSupplierLinked = async (storeUserId: string, supplierUserId: string) => {
  const rows = await db
    .select({
      supplierUserId: user.id,
      name: user.name,
      email: user.email,
      businessName: user.businessName,
    })
    .from(storeSuppliers)
    .innerJoin(user, eq(user.id, storeSuppliers.supplierUserId))
    .where(and(
      eq(storeSuppliers.storeUserId, storeUserId),
      eq(storeSuppliers.supplierUserId, supplierUserId),
    ))
    .limit(1);

  return rows[0] ?? null;
};

const ensureStoreLinked = async (supplierUserId: string, storeUserId: string) => {
  const rows = await db
    .select({
      storeUserId: user.id,
      name: user.name,
      email: user.email,
      businessName: user.businessName,
    })
    .from(storeSuppliers)
    .innerJoin(user, eq(user.id, storeSuppliers.storeUserId))
    .where(and(
      eq(storeSuppliers.supplierUserId, supplierUserId),
      eq(storeSuppliers.storeUserId, storeUserId),
    ))
    .limit(1);

  return rows[0] ?? null;
};

const getSupplierBalanceSummary = async (storeUserId: string, supplierUserId: string) => {
  const [salesRows, payoutRows] = await Promise.all([
    db
      .select({ supplierTotal: salesTransactionItems.supplierTotal })
      .from(salesTransactionItems)
      .innerJoin(salesTransactions, eq(salesTransactions.id, salesTransactionItems.transactionId))
      .where(and(
        eq(salesTransactions.storeUserId, storeUserId),
        eq(salesTransactionItems.supplierUserId, supplierUserId),
      )),
    db
      .select({
        id: supplierPayouts.id,
        amount: supplierPayouts.amount,
        note: supplierPayouts.note,
        createdAt: supplierPayouts.createdAt,
      })
      .from(supplierPayouts)
      .where(and(
        eq(supplierPayouts.storeUserId, storeUserId),
        eq(supplierPayouts.supplierUserId, supplierUserId),
      ))
      .orderBy(desc(supplierPayouts.createdAt)),
  ]);

  const totalEarned = salesRows.reduce((sum, item) => sum + Number(item.supplierTotal), 0);
  const totalPaidOut = payoutRows.reduce((sum, item) => sum + Number(item.amount), 0);

  return {
    totalEarned,
    totalPaidOut,
    availableBalance: Math.max(0, totalEarned - totalPaidOut),
    payouts: payoutRows.map((item) => ({
      id: item.id,
      amount: Number(item.amount),
      note: item.note,
      createdAt: item.createdAt,
    })),
  };
};

app.put('/api/users/:userId/profile', async (req, res) => {
  const { userId } = req.params;
  const name = String(req.body?.name ?? '').trim();
  const businessName = String(req.body?.businessName ?? '').trim();
  const image = typeof req.body?.image === 'string' && req.body.image.trim().length > 0
    ? req.body.image.trim()
    : null;

  if (!name || !businessName) {
    res.status(400).json({ message: 'name and businessName are required' });
    return;
  }

  const existing = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!existing[0]) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const [updated] = await db
    .update(user)
    .set({
      name,
      businessName,
      image,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      accountType: user.accountType,
      businessName: user.businessName,
    });

  res.json({ data: updated });
});

app.get('/api/suppliers/search', async (req, res) => {
  const query = String(req.query.q ?? '').trim();
  const storeUserId = String(req.query.storeUserId ?? '').trim();

  if (!query || !storeUserId) {
    res.json({ data: [] });
    return;
  }

  const results = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      businessName: user.businessName,
      accountType: user.accountType,
    })
    .from(user)
    .where(and(
      eq(user.accountType, 'supplier'),
      or(
        ilike(user.name, `%${query}%`),
        ilike(user.businessName, `%${query}%`),
        ilike(user.email, `%${query}%`),
      ),
    ))
    .limit(10);

  const linked = await db
    .select({ supplierUserId: storeSuppliers.supplierUserId })
    .from(storeSuppliers)
    .where(eq(storeSuppliers.storeUserId, storeUserId));

  const linkedIds = new Set(linked.map((item) => item.supplierUserId));

  res.json({
    data: results.map((item) => ({
      ...item,
      linked: linkedIds.has(item.id),
    })),
  });
});

app.get('/api/stores/:storeUserId/suppliers', async (req, res) => {
  const { storeUserId } = req.params;

  const rows = await db
    .select({
      linkId: storeSuppliers.id,
      supplierUserId: user.id,
      name: user.name,
      email: user.email,
      businessName: user.businessName,
    })
    .from(storeSuppliers)
    .innerJoin(user, eq(user.id, storeSuppliers.supplierUserId))
    .where(eq(storeSuppliers.storeUserId, storeUserId));

  res.json({ data: rows });
});

app.get('/api/suppliers/:supplierUserId/stores', async (req, res) => {
  const { supplierUserId } = req.params;

  const rows = await db
    .select({
      linkId: storeSuppliers.id,
      storeUserId: user.id,
      name: user.name,
      email: user.email,
      businessName: user.businessName,
    })
    .from(storeSuppliers)
    .innerJoin(user, eq(user.id, storeSuppliers.storeUserId))
    .where(eq(storeSuppliers.supplierUserId, supplierUserId));

  res.json({ data: rows });
});

app.get('/api/suppliers/:supplierUserId/overview', async (req, res) => {
  const { supplierUserId } = req.params;

  const linkedStores = await db
    .select({
      linkId: storeSuppliers.id,
      storeUserId: user.id,
      name: user.name,
      email: user.email,
      businessName: user.businessName,
    })
    .from(storeSuppliers)
    .innerJoin(user, eq(user.id, storeSuppliers.storeUserId))
    .where(eq(storeSuppliers.supplierUserId, supplierUserId));

  const storeIds = linkedStores.map((item) => item.storeUserId);

  if (storeIds.length === 0) {
    res.json({
      data: {
        linkedStoreCount: 0,
        productCount: 0,
        currentStock: 0,
        availableBalance: 0,
        linkedStores: [],
      },
    });
    return;
  }

  const [products, salesRows, payoutRows] = await Promise.all([
    db
      .select({
        id: consignedProducts.id,
        currentStock: consignedProducts.currentStock,
      })
      .from(consignedProducts)
      .where(and(
        eq(consignedProducts.supplierUserId, supplierUserId),
        inArray(consignedProducts.storeUserId, storeIds),
      )),
    db
      .select({ supplierTotal: salesTransactionItems.supplierTotal })
      .from(salesTransactionItems)
      .innerJoin(salesTransactions, eq(salesTransactions.id, salesTransactionItems.transactionId))
      .where(and(
        eq(salesTransactionItems.supplierUserId, supplierUserId),
        inArray(salesTransactions.storeUserId, storeIds),
      )),
    db
      .select({ amount: supplierPayouts.amount })
      .from(supplierPayouts)
      .where(and(
        eq(supplierPayouts.supplierUserId, supplierUserId),
        inArray(supplierPayouts.storeUserId, storeIds),
      )),
  ]);

  const totalEarned = salesRows.reduce((sum, item) => sum + Number(item.supplierTotal), 0);
  const totalPaidOut = payoutRows.reduce((sum, item) => sum + Number(item.amount), 0);

  res.json({
    data: {
      linkedStoreCount: linkedStores.length,
      productCount: products.length,
      currentStock: products.reduce((sum, item) => sum + Number(item.currentStock), 0),
      availableBalance: Math.max(0, totalEarned - totalPaidOut),
      linkedStores,
    },
  });
});

app.get('/api/suppliers/:supplierUserId/stores/:storeUserId/products', async (req, res) => {
  const { supplierUserId, storeUserId } = req.params;
  const store = await ensureStoreLinked(supplierUserId, storeUserId);

  if (!store) {
    res.status(404).json({ message: 'Store not found' });
    return;
  }

  const rows = await db
    .select({
      id: consignedProducts.id,
      name: consignedProducts.name,
      imageUrl: consignedProducts.imageUrl,
      sellPrice: consignedProducts.sellPrice,
      supplierPrice: consignedProducts.supplierPrice,
      initialQuantity: consignedProducts.initialQuantity,
      currentStock: consignedProducts.currentStock,
      createdAt: consignedProducts.createdAt,
      updatedAt: consignedProducts.updatedAt,
    })
    .from(consignedProducts)
    .where(and(
      eq(consignedProducts.storeUserId, storeUserId),
      eq(consignedProducts.supplierUserId, supplierUserId),
    ));

  res.json({ data: rows });
});

app.get('/api/suppliers/:supplierUserId/stores/:storeUserId/balance', async (req, res) => {
  const { supplierUserId, storeUserId } = req.params;
  const store = await ensureStoreLinked(supplierUserId, storeUserId);

  if (!store) {
    res.status(404).json({ message: 'Store not found' });
    return;
  }

  const summary = await getSupplierBalanceSummary(storeUserId, supplierUserId);

  res.json({
    data: {
      supplier: {
        supplierUserId,
        name: '',
        email: '',
        businessName: null,
      },
      ...summary,
    },
  });
});

app.get('/api/suppliers/:supplierUserId/stores/:storeUserId/history', async (req, res) => {
  const { supplierUserId, storeUserId } = req.params;
  const store = await ensureStoreLinked(supplierUserId, storeUserId);

  if (!store) {
    res.status(404).json({ message: 'Store not found' });
    return;
  }

  const [consignments, stockAdditions] = await Promise.all([
    db
      .select()
      .from(consignmentHistory)
      .where(and(
        eq(consignmentHistory.storeUserId, storeUserId),
        eq(consignmentHistory.supplierUserId, supplierUserId),
      ))
      .orderBy(desc(consignmentHistory.createdAt)),
    db
      .select()
      .from(stockAdditionHistory)
      .where(and(
        eq(stockAdditionHistory.storeUserId, storeUserId),
        eq(stockAdditionHistory.supplierUserId, supplierUserId),
      ))
      .orderBy(desc(stockAdditionHistory.createdAt)),
  ]);

  res.json({
    data: {
      supplier: {
        supplierUserId,
        name: '',
        email: '',
        businessName: null,
      },
      stockEntries: [
        ...consignments.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          type: 'consignment' as const,
          label: 'Titip awal',
          sellPrice: Number(item.sellPrice),
          supplierPrice: Number(item.supplierPrice),
          previousStock: null,
          newStock: item.quantity,
          createdAt: item.createdAt,
        })),
        ...stockAdditions.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: Math.abs(item.quantity),
          type: item.quantity >= 0 ? 'restock' as const : 'withdrawal' as const,
          label: item.quantity >= 0 ? 'Tambah stok' : 'Ambil kembali',
          sellPrice: null,
          supplierPrice: null,
          previousStock: item.previousStock,
          newStock: item.newStock,
          createdAt: item.createdAt,
        })),
      ].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
    },
  });
});

app.get('/api/stores/:storeUserId/products', async (req, res) => {
  const { storeUserId } = req.params;

  const rows = await db
    .select({
      id: consignedProducts.id,
      supplierUserId: consignedProducts.supplierUserId,
      name: consignedProducts.name,
      imageUrl: consignedProducts.imageUrl,
      sellPrice: consignedProducts.sellPrice,
      supplierPrice: consignedProducts.supplierPrice,
      initialQuantity: consignedProducts.initialQuantity,
      currentStock: consignedProducts.currentStock,
      createdAt: consignedProducts.createdAt,
      updatedAt: consignedProducts.updatedAt,
      supplierName: user.name,
      supplierEmail: user.email,
      supplierBusinessName: user.businessName,
    })
    .from(consignedProducts)
    .innerJoin(user, eq(user.id, consignedProducts.supplierUserId))
    .where(eq(consignedProducts.storeUserId, storeUserId));

  res.json({ data: rows });
});

app.get('/api/stores/:storeUserId/products/:productId', async (req, res) => {
  const { storeUserId, productId } = req.params;

  const rows = await db
    .select({
      id: consignedProducts.id,
      supplierUserId: consignedProducts.supplierUserId,
      name: consignedProducts.name,
      imageUrl: consignedProducts.imageUrl,
      sellPrice: consignedProducts.sellPrice,
      supplierPrice: consignedProducts.supplierPrice,
      initialQuantity: consignedProducts.initialQuantity,
      currentStock: consignedProducts.currentStock,
      createdAt: consignedProducts.createdAt,
      updatedAt: consignedProducts.updatedAt,
      supplierName: user.name,
      supplierEmail: user.email,
      supplierBusinessName: user.businessName,
    })
    .from(consignedProducts)
    .innerJoin(user, eq(user.id, consignedProducts.supplierUserId))
    .where(and(
      eq(consignedProducts.id, productId),
      eq(consignedProducts.storeUserId, storeUserId),
    ))
    .limit(1);

  const product = rows[0];

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  res.json({ data: product });
});

app.get('/api/stores/:storeUserId/transactions', async (req, res) => {
  const { storeUserId } = req.params;

  const rows = await db
    .select()
    .from(salesTransactions)
    .where(eq(salesTransactions.storeUserId, storeUserId))
    .orderBy(desc(salesTransactions.createdAt));

  if (rows.length === 0) {
    res.json({ data: [] });
    return;
  }

  const items = await db
    .select({
      transactionId: salesTransactionItems.transactionId,
      quantity: salesTransactionItems.quantity,
    })
    .from(salesTransactionItems)
    .where(inArray(
      salesTransactionItems.transactionId,
      rows.map((item) => item.id),
    ));

  const quantityMap = new Map<string, number>();
  for (const item of items) {
    quantityMap.set(item.transactionId, (quantityMap.get(item.transactionId) ?? 0) + item.quantity);
  }

  res.json({
    data: rows.map((item) => ({
      ...item,
      itemCount: quantityMap.get(item.id) ?? 0,
    })),
  });
});

app.get('/api/stores/:storeUserId/transactions/:transactionId', async (req, res) => {
  const { storeUserId, transactionId } = req.params;

  const transactionRows = await db
    .select()
    .from(salesTransactions)
    .where(and(
      eq(salesTransactions.id, transactionId),
      eq(salesTransactions.storeUserId, storeUserId),
    ))
    .limit(1);

  const transaction = transactionRows[0];

  if (!transaction) {
    res.status(404).json({ message: 'Transaction not found' });
    return;
  }

  const items = await db
    .select()
    .from(salesTransactionItems)
    .where(eq(salesTransactionItems.transactionId, transactionId));

  res.json({
    data: {
      ...transaction,
      items,
    },
  });
});

app.get('/api/stores/:storeUserId/reports/overview', async (req, res) => {
  const { storeUserId } = req.params;

  const [transactions, suppliers, products] = await Promise.all([
    db
      .select()
      .from(salesTransactions)
      .where(eq(salesTransactions.storeUserId, storeUserId))
      .orderBy(desc(salesTransactions.createdAt)),
    db
      .select({ supplierUserId: storeSuppliers.supplierUserId })
      .from(storeSuppliers)
      .where(eq(storeSuppliers.storeUserId, storeUserId)),
    db
      .select({ id: consignedProducts.id, currentStock: consignedProducts.currentStock })
      .from(consignedProducts)
      .where(eq(consignedProducts.storeUserId, storeUserId)),
  ]);

  const transactionIds = transactions.map((item) => item.id);
  const items = transactionIds.length === 0
    ? []
    : await db
      .select({
        transactionId: salesTransactionItems.transactionId,
        quantity: salesTransactionItems.quantity,
      })
      .from(salesTransactionItems)
      .where(inArray(salesTransactionItems.transactionId, transactionIds));

  const soldItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const currentStock = products.reduce((sum, item) => sum + item.currentStock, 0);

  res.json({
    data: {
      transactionCount: transactions.length,
      totalSales: transactions.reduce((sum, item) => sum + Number(item.totalAmount), 0),
      supplierAmount: transactions.reduce((sum, item) => sum + Number(item.supplierAmount), 0),
      storeAmount: transactions.reduce((sum, item) => sum + Number(item.storeAmount), 0),
      soldItems,
      supplierCount: suppliers.length,
      productCount: products.length,
      currentStock,
      recentTransactions: transactions.slice(0, 6),
    },
  });
});

app.get('/api/stores/:storeUserId/reports/suppliers/:supplierUserId', async (req, res) => {
  const { storeUserId, supplierUserId } = req.params;

  const supplier = await ensureSupplierLinked(storeUserId, supplierUserId);

  if (!supplier) {
    res.status(404).json({ message: 'Supplier not found' });
    return;
  }

  const productRows = await db
    .select({
      id: consignedProducts.id,
      currentStock: consignedProducts.currentStock,
      initialQuantity: consignedProducts.initialQuantity,
    })
    .from(consignedProducts)
    .where(and(
      eq(consignedProducts.storeUserId, storeUserId),
      eq(consignedProducts.supplierUserId, supplierUserId),
    ));

  const transactionRows = await db
    .select({
      transactionId: salesTransactions.id,
      code: salesTransactions.code,
      createdAt: salesTransactions.createdAt,
      itemId: salesTransactionItems.id,
      quantity: salesTransactionItems.quantity,
      totalPrice: salesTransactionItems.totalPrice,
      supplierTotal: salesTransactionItems.supplierTotal,
      storeTotal: salesTransactionItems.storeTotal,
    })
    .from(salesTransactionItems)
    .innerJoin(salesTransactions, eq(salesTransactions.id, salesTransactionItems.transactionId))
    .where(and(
      eq(salesTransactions.storeUserId, storeUserId),
      eq(salesTransactionItems.supplierUserId, supplierUserId),
    ))
    .orderBy(desc(salesTransactions.createdAt));

  const rows = transactionRows.map((item) => ({
    id: item.transactionId,
    code: item.code,
    createdAt: item.createdAt,
    quantity: item.quantity,
    revenue: Number(item.totalPrice),
    supplierAmount: Number(item.supplierTotal),
    storeAmount: Number(item.storeTotal),
  }));

  const balance = await getSupplierBalanceSummary(storeUserId, supplierUserId);

  res.json({
    data: {
      supplier,
      productCount: productRows.length,
      soldItems: rows.reduce((sum, item) => sum + item.quantity, 0),
      currentStock: productRows.reduce((sum, item) => sum + item.currentStock, 0),
      totalSales: rows.reduce((sum, item) => sum + item.revenue, 0),
      supplierAmount: rows.reduce((sum, item) => sum + item.supplierAmount, 0),
      storeAmount: rows.reduce((sum, item) => sum + item.storeAmount, 0),
      paidOutAmount: balance.totalPaidOut,
      availableBalance: balance.availableBalance,
      transactions: rows,
    },
  });
});

app.get('/api/stores/:storeUserId/suppliers/:supplierUserId/balance', async (req, res) => {
  const { storeUserId, supplierUserId } = req.params;
  const supplier = await ensureSupplierLinked(storeUserId, supplierUserId);

  if (!supplier) {
    res.status(404).json({ message: 'Supplier not found' });
    return;
  }

  const summary = await getSupplierBalanceSummary(storeUserId, supplierUserId);

  res.json({
    data: {
      supplier,
      ...summary,
    },
  });
});

app.get('/api/stores/:storeUserId/suppliers/:supplierUserId/history', async (req, res) => {
  const { storeUserId, supplierUserId } = req.params;
  const supplier = await ensureSupplierLinked(storeUserId, supplierUserId);

  if (!supplier) {
    res.status(404).json({ message: 'Supplier not found' });
    return;
  }

  const [consignments, stockAdditions] = await Promise.all([
    db
      .select()
      .from(consignmentHistory)
      .where(and(
        eq(consignmentHistory.storeUserId, storeUserId),
        eq(consignmentHistory.supplierUserId, supplierUserId),
      ))
      .orderBy(desc(consignmentHistory.createdAt)),
    db
      .select()
      .from(stockAdditionHistory)
      .where(and(
        eq(stockAdditionHistory.storeUserId, storeUserId),
        eq(stockAdditionHistory.supplierUserId, supplierUserId),
      ))
      .orderBy(desc(stockAdditionHistory.createdAt)),
  ]);

  res.json({
    data: {
      supplier,
      stockEntries: [
        ...consignments.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          type: 'consignment' as const,
          label: 'Titip awal',
          sellPrice: Number(item.sellPrice),
          supplierPrice: Number(item.supplierPrice),
          previousStock: null,
          newStock: item.quantity,
          createdAt: item.createdAt,
        })),
        ...stockAdditions.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: Math.abs(item.quantity),
          type: item.quantity >= 0 ? 'restock' as const : 'withdrawal' as const,
          label: item.quantity >= 0 ? 'Tambah stok' : 'Ambil kembali',
          sellPrice: null,
          supplierPrice: null,
          previousStock: item.previousStock,
          newStock: item.newStock,
          createdAt: item.createdAt,
        })),
      ].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
    },
  });
});

app.get('/api/stores/:storeUserId/suppliers/:supplierUserId/products', async (req, res) => {
  const { storeUserId, supplierUserId } = req.params;

  const rows = await db
    .select({
      id: consignedProducts.id,
      name: consignedProducts.name,
      imageUrl: consignedProducts.imageUrl,
      sellPrice: consignedProducts.sellPrice,
      supplierPrice: consignedProducts.supplierPrice,
      initialQuantity: consignedProducts.initialQuantity,
      currentStock: consignedProducts.currentStock,
      createdAt: consignedProducts.createdAt,
      updatedAt: consignedProducts.updatedAt,
    })
    .from(consignedProducts)
    .where(and(
      eq(consignedProducts.storeUserId, storeUserId),
      eq(consignedProducts.supplierUserId, supplierUserId),
    ));

  res.json({ data: rows });
});

app.post('/api/stores/:storeUserId/suppliers', async (req, res) => {
  const { storeUserId } = req.params;
  const supplierUserId = String(req.body?.supplierUserId ?? '').trim();

  if (!supplierUserId) {
    res.status(400).json({ message: 'supplierUserId is required' });
    return;
  }

  const [storeUser, supplierUser] = await Promise.all([
    db.select().from(user).where(eq(user.id, storeUserId)).limit(1),
    db.select().from(user).where(eq(user.id, supplierUserId)).limit(1),
  ]);

  if (!storeUser[0] || storeUser[0].accountType !== 'store') {
    res.status(400).json({ message: 'Store account not found' });
    return;
  }

  if (!supplierUser[0] || supplierUser[0].accountType !== 'supplier') {
    res.status(400).json({ message: 'Supplier account not found' });
    return;
  }

  const existing = await db
    .select({ id: storeSuppliers.id })
    .from(storeSuppliers)
    .where(and(
      eq(storeSuppliers.storeUserId, storeUserId),
      eq(storeSuppliers.supplierUserId, supplierUserId),
    ))
    .limit(1);

  if (!existing[0]) {
    await db.insert(storeSuppliers).values({
      storeUserId,
      supplierUserId,
    });
  }

  res.status(201).json({ success: true });
});

app.post('/api/stores/:storeUserId/suppliers/:supplierUserId/products', async (req, res) => {
  const { storeUserId, supplierUserId } = req.params;
  const name = String(req.body?.name ?? '').trim();
  const imageUrl = typeof req.body?.imageUrl === 'string' && req.body.imageUrl.trim().length > 0
    ? req.body.imageUrl.trim()
    : null;
  const sellPrice = Number(req.body?.sellPrice ?? 0);
  const supplierPrice = Number(req.body?.supplierPrice ?? 0);
  const quantity = Number(req.body?.quantity ?? 0);

  if (!name || !sellPrice || quantity <= 0) {
    res.status(400).json({ message: 'name, sellPrice, and quantity are required' });
    return;
  }

  const linked = await db
    .select({ id: storeSuppliers.id })
    .from(storeSuppliers)
    .where(and(
      eq(storeSuppliers.storeUserId, storeUserId),
      eq(storeSuppliers.supplierUserId, supplierUserId),
    ))
    .limit(1);

  if (!linked[0]) {
    res.status(400).json({ message: 'Supplier is not linked to this store' });
    return;
  }

  const [created] = await db.insert(consignedProducts).values({
    storeUserId,
    supplierUserId,
    name,
    imageUrl,
    sellPrice: String(sellPrice),
    supplierPrice: String(supplierPrice),
    initialQuantity: quantity,
    currentStock: quantity,
  }).returning();

  await db.insert(consignmentHistory).values({
    storeUserId,
    supplierUserId,
    productId: created.id,
    productName: name,
    quantity,
    sellPrice: String(sellPrice),
    supplierPrice: String(supplierPrice),
  });

  res.status(201).json({ data: created });
});

app.put('/api/stores/:storeUserId/suppliers/:supplierUserId/products/:productId', async (req, res) => {
  const { storeUserId, supplierUserId, productId } = req.params;
  const name = String(req.body?.name ?? '').trim();
  const imageUrl = typeof req.body?.imageUrl === 'string' && req.body.imageUrl.trim().length > 0
    ? req.body.imageUrl.trim()
    : null;
  const sellPrice = Number(req.body?.sellPrice ?? 0);
  const supplierPrice = Number(req.body?.supplierPrice ?? 0);
  const quantity = Number(req.body?.quantity ?? 0);
  const currentStock = Number(req.body?.currentStock ?? quantity);

  if (!name || !sellPrice || quantity <= 0 || currentStock < 0 || currentStock > quantity) {
    res.status(400).json({ message: 'name, sellPrice, quantity, and valid currentStock are required' });
    return;
  }

  const existing = await db
    .select({ id: consignedProducts.id })
    .from(consignedProducts)
    .where(and(
      eq(consignedProducts.id, productId),
      eq(consignedProducts.storeUserId, storeUserId),
      eq(consignedProducts.supplierUserId, supplierUserId),
    ))
    .limit(1);

  if (!existing[0]) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const [updated] = await db.update(consignedProducts).set({
    name,
    imageUrl,
    sellPrice: String(sellPrice),
    supplierPrice: String(supplierPrice),
    initialQuantity: quantity,
    currentStock,
    updatedAt: new Date(),
  }).where(eq(consignedProducts.id, productId)).returning();

  res.json({ data: updated });
});

app.post('/api/stores/:storeUserId/suppliers/:supplierUserId/products/:productId/add-stock', async (req, res) => {
  const { storeUserId, supplierUserId, productId } = req.params;
  const quantity = Number(req.body?.quantity ?? 0);

  if (quantity <= 0) {
    res.status(400).json({ message: 'quantity must be greater than 0' });
    return;
  }

  const existing = await db
    .select()
    .from(consignedProducts)
    .where(and(
      eq(consignedProducts.id, productId),
      eq(consignedProducts.storeUserId, storeUserId),
      eq(consignedProducts.supplierUserId, supplierUserId),
    ))
    .limit(1);

  const product = existing[0];

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const [updated] = await db.update(consignedProducts).set({
    initialQuantity: product.initialQuantity + quantity,
    currentStock: product.currentStock + quantity,
    updatedAt: new Date(),
  }).where(eq(consignedProducts.id, productId)).returning();

  await db.insert(stockAdditionHistory).values({
    storeUserId,
    supplierUserId,
    productId: product.id,
    productName: product.name,
    quantity,
    previousStock: product.currentStock,
    newStock: updated.currentStock,
  });

  res.json({ data: updated });
});

app.post('/api/stores/:storeUserId/suppliers/:supplierUserId/products/:productId/remove-stock', async (req, res) => {
  const { storeUserId, supplierUserId, productId } = req.params;
  const quantity = Number(req.body?.quantity ?? 0);

  if (quantity <= 0) {
    res.status(400).json({ message: 'quantity must be greater than 0' });
    return;
  }

  const existing = await db
    .select()
    .from(consignedProducts)
    .where(and(
      eq(consignedProducts.id, productId),
      eq(consignedProducts.storeUserId, storeUserId),
      eq(consignedProducts.supplierUserId, supplierUserId),
    ))
    .limit(1);

  const product = existing[0];

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  if (quantity > product.currentStock) {
    res.status(400).json({ message: 'quantity exceeds current stock' });
    return;
  }

  const [updated] = await db.update(consignedProducts).set({
    initialQuantity: product.initialQuantity - quantity,
    currentStock: product.currentStock - quantity,
    updatedAt: new Date(),
  }).where(eq(consignedProducts.id, productId)).returning();

  await db.insert(stockAdditionHistory).values({
    storeUserId,
    supplierUserId,
    productId: product.id,
    productName: product.name,
    quantity: -quantity,
    previousStock: product.currentStock,
    newStock: updated.currentStock,
  });

  res.json({ data: updated });
});

app.post('/api/stores/:storeUserId/suppliers/:supplierUserId/payouts', async (req, res) => {
  const { storeUserId, supplierUserId } = req.params;
  const amount = Number(req.body?.amount ?? 0);
  const note = typeof req.body?.note === 'string' && req.body.note.trim().length > 0
    ? req.body.note.trim()
    : null;

  if (amount <= 0) {
    res.status(400).json({ message: 'amount must be greater than 0' });
    return;
  }

  const supplier = await ensureSupplierLinked(storeUserId, supplierUserId);

  if (!supplier) {
    res.status(404).json({ message: 'Supplier not found' });
    return;
  }

  const balance = await getSupplierBalanceSummary(storeUserId, supplierUserId);

  if (amount > balance.availableBalance) {
    res.status(400).json({ message: 'amount exceeds available supplier balance' });
    return;
  }

  const [created] = await db.insert(supplierPayouts).values({
    storeUserId,
    supplierUserId,
    amount: String(amount),
    note,
  }).returning();

  const updatedBalance = await getSupplierBalanceSummary(storeUserId, supplierUserId);

  res.status(201).json({
    data: {
      payout: {
        id: created.id,
        amount: Number(created.amount),
        note: created.note,
        createdAt: created.createdAt,
      },
      availableBalance: updatedBalance.availableBalance,
      totalPaidOut: updatedBalance.totalPaidOut,
    },
  });
});

app.post('/api/stores/:storeUserId/transactions', async (req, res) => {
  const { storeUserId } = req.params;
  const items: Array<{ productId?: unknown; quantity?: unknown }> = Array.isArray(req.body?.items) ? req.body.items : [];

  if (items.length === 0) {
    res.status(400).json({ message: 'items are required' });
    return;
  }

  const normalizedItems = items
    .map((item) => ({
      productId: String(item?.productId ?? '').trim(),
      quantity: Number(item?.quantity ?? 0),
    }))
    .filter((item) => item.productId && item.quantity > 0);

  if (normalizedItems.length === 0) {
    res.status(400).json({ message: 'items are invalid' });
    return;
  }

  const quantities = new Map<string, number>();
  for (const item of normalizedItems) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  const productIds = Array.from(quantities.keys());

  const products = await db
    .select({
      id: consignedProducts.id,
      supplierUserId: consignedProducts.supplierUserId,
      name: consignedProducts.name,
      currentStock: consignedProducts.currentStock,
      sellPrice: consignedProducts.sellPrice,
      supplierPrice: consignedProducts.supplierPrice,
      supplierName: user.name,
      supplierBusinessName: user.businessName,
    })
    .from(consignedProducts)
    .innerJoin(user, eq(user.id, consignedProducts.supplierUserId))
    .where(and(
      eq(consignedProducts.storeUserId, storeUserId),
      inArray(consignedProducts.id, productIds),
    ));

  if (products.length !== productIds.length) {
    res.status(400).json({ message: 'Some products are not available for this store' });
    return;
  }

  for (const product of products) {
    const soldQuantity = quantities.get(product.id) ?? 0;
    if (soldQuantity > product.currentStock) {
      res.status(400).json({ message: `Stock for ${product.name} is not enough` });
      return;
    }
  }

  const code = createTransactionCode();
  const lineItems = products.map((product) => {
    const quantity = quantities.get(product.id) ?? 0;
    const unitPrice = Number(product.sellPrice);
    const supplierUnitPrice = Number(product.supplierPrice);
    const totalPrice = unitPrice * quantity;
    const supplierTotal = supplierUnitPrice * quantity;
    const storeTotal = totalPrice - supplierTotal;

    return {
      productId: product.id,
      supplierUserId: product.supplierUserId,
      productName: product.name,
      supplierName: product.supplierBusinessName || product.supplierName,
      quantity,
      unitPrice,
      supplierUnitPrice,
      totalPrice,
      supplierTotal,
      storeTotal,
    };
  });

  const totalAmount = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const supplierAmount = lineItems.reduce((sum, item) => sum + item.supplierTotal, 0);
  const storeAmount = lineItems.reduce((sum, item) => sum + item.storeTotal, 0);

  const created = await db.transaction(async (tx) => {
    const [transaction] = await tx
      .insert(salesTransactions)
      .values({
        code,
        storeUserId,
        totalAmount: String(totalAmount),
        supplierAmount: String(supplierAmount),
        storeAmount: String(storeAmount),
      })
      .returning();

    await tx.insert(salesTransactionItems).values(lineItems.map((item) => ({
      transactionId: transaction.id,
      productId: item.productId,
      supplierUserId: item.supplierUserId,
      productName: item.productName,
      supplierName: item.supplierName,
      quantity: item.quantity,
      unitPrice: String(item.unitPrice),
      supplierUnitPrice: String(item.supplierUnitPrice),
      totalPrice: String(item.totalPrice),
      supplierTotal: String(item.supplierTotal),
      storeTotal: String(item.storeTotal),
    })));

    await Promise.all(products.map((product) => tx
      .update(consignedProducts)
      .set({
        currentStock: product.currentStock - (quantities.get(product.id) ?? 0),
        updatedAt: new Date(),
      })
      .where(eq(consignedProducts.id, product.id))));

    return transaction;
  });

  res.status(201).json({ data: created });
});

app.delete('/api/stores/:storeUserId/suppliers/:supplierUserId/products/:productId', async (req, res) => {
  const { storeUserId, supplierUserId, productId } = req.params;

  const existing = await db
    .select({ id: consignedProducts.id })
    .from(consignedProducts)
    .where(and(
      eq(consignedProducts.id, productId),
      eq(consignedProducts.storeUserId, storeUserId),
      eq(consignedProducts.supplierUserId, supplierUserId),
    ))
    .limit(1);

  if (!existing[0]) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  await db.delete(consignedProducts).where(eq(consignedProducts.id, productId));
  res.json({ success: true });
});

export const apiRouter = app;
