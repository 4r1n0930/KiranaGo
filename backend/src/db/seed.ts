import dotenv from 'dotenv';
dotenv.config();

import { dbConnect } from './connect';
import { Product } from '../models/Product';

export async function seedDB(): Promise<void> {
  await dbConnect();
  console.log('[Seed] Clearing existing products...');
  await Product.deleteMany({});

  const now = new Date();
  const pastDate1 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
  const pastDate2 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
  const futureDate1 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days ahead
  const futureDate2 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days ahead

  const sampleProducts = [
    // 4 Healthy products (stock well above threshold)
    {
      productId: 'PROD-101',
      name: 'Maggi 2-Minute Noodles',
      category: 'Instant Food',
      price: 14,
      stock: 50,
      reorderThreshold: 10
    },
    {
      productId: 'PROD-102',
      name: 'Amul Taaza Toned Milk 500ml',
      category: 'Dairy',
      price: 30,
      stock: 40,
      reorderThreshold: 10
    },
    {
      productId: 'PROD-103',
      name: 'Surf Excel Easy Wash Detergent Powder 1kg',
      category: 'Household Care',
      price: 140,
      stock: 30,
      reorderThreshold: 5
    },
    {
      productId: 'PROD-104',
      name: 'Aashirvaad Shudh Chakki Atta 5kg',
      category: 'Staples',
      price: 250,
      stock: 25,
      reorderThreshold: 8
    },

    // 3 Low-stock products (stock below reorderThreshold)
    {
      productId: 'PROD-105',
      name: 'Parle-G Glucose Biscuits 250g',
      category: 'Biscuits & Snacks',
      price: 10,
      stock: 4,
      reorderThreshold: 10
    },
    {
      productId: 'PROD-106',
      name: 'Colgate Strong Toothpaste 100g',
      category: 'Oral Care',
      price: 55,
      stock: 3,
      reorderThreshold: 10
    },
    {
      productId: 'PROD-107',
      name: 'Fortune Sunlite Refined Sunflower Oil 1L',
      category: 'Edible Oils',
      price: 160,
      stock: 2,
      reorderThreshold: 5
    },

    // 2 Expired products (expiryDate in past, stock > 0)
    {
      productId: 'PROD-108',
      name: 'Modern Bread White 400g',
      category: 'Bakery',
      price: 40,
      stock: 12,
      reorderThreshold: 5,
      expiryDate: pastDate1
    },
    {
      productId: 'PROD-109',
      name: 'Harvest Gold White Bread 400g',
      category: 'Bakery',
      price: 45,
      stock: 8,
      reorderThreshold: 5,
      expiryDate: pastDate2
    },

    // 2 Fresh products with future expiryDate
    {
      productId: 'PROD-110',
      name: 'Amul Butter Pasteurised 100g',
      category: 'Dairy',
      price: 58,
      stock: 20,
      reorderThreshold: 5,
      expiryDate: futureDate1
    },
    {
      productId: 'PROD-111',
      name: 'Haldiram Bhujia Sev 200g',
      category: 'Biscuits & Snacks',
      price: 40,
      stock: 18,
      reorderThreshold: 5,
      expiryDate: futureDate2
    },

    // 1 Out of stock product (stock = 0)
    {
      productId: 'PROD-112',
      name: 'Tata Salt Vacuum Evaporated Iodised 1kg',
      category: 'Staples',
      price: 28,
      stock: 0,
      reorderThreshold: 10
    }
  ];

  await Product.insertMany(sampleProducts);
  console.log(`[Seed] Successfully inserted ${sampleProducts.length} sample products.`);
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seedDB()
    .then(() => {
      console.log('[Seed] Seeding completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Error during seeding:', err);
      process.exit(1);
    });
}