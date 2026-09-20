import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { Product } from '../models/Product';
import { ImportResult } from '../tools/types';

export async function importFromCSV(filePath: string): Promise<ImportResult> {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const total = records.length;
  let inserted = 0;
  let updated = 0;
  const failed: { row: number; data: any; reason: string }[] = [];

  for (let i = 0; i < records.length; i++) {
    const rowNumber = i + 1;
    const row: any = records[i];

    const productId = row.productId?.trim();
    const name = row.name?.trim();
    const category = row.category?.trim();
    const price = Number(row.price);
    const stock = Number(row.stock);
    const reorderThreshold = Number(row.reorderThreshold);
    const expiryDateStr = row.expiryDate?.trim();

    // Validation checks
    if (!productId || !name || !category) {
      failed.push({
        row: rowNumber,
        data: row,
        reason: 'Missing required fields (productId, name, category)'
      });
      continue;
    }

    if (isNaN(price) || price < 0) {
      failed.push({
        row: rowNumber,
        data: row,
        reason: 'Price must be a non-negative number'
      });
      continue;
    }

    if (isNaN(stock) || stock < 0) {
      failed.push({
        row: rowNumber,
        data: row,
        reason: 'Stock must be a non-negative number'
      });
      continue;
    }

    if (isNaN(reorderThreshold) || reorderThreshold < 0) {
      failed.push({
        row: rowNumber,
        data: row,
        reason: 'Reorder threshold must be a non-negative number'
      });
      continue;
    }

    let expiryDate: Date | undefined;
    if (expiryDateStr) {
      const parsedDate = new Date(expiryDateStr);
      if (isNaN(parsedDate.getTime())) {
        failed.push({
          row: rowNumber,
          data: row,
          reason: 'Invalid expiryDate ISO format'
        });
        continue;
      }
      expiryDate = parsedDate;
    }

    const existingProduct = await Product.findOne({ productId });

    await Product.updateOne(
      { productId },
      {
        $set: {
          name,
          category,
          price,
          stock,
          reorderThreshold,
          ...(expiryDate ? { expiryDate } : {})
        }
      },
      { upsert: true }
    );

    if (existingProduct) {
      updated++;
    } else {
      inserted++;
    }
  }

  return {
    total,
    inserted,
    updated,
    failed
  };
}
