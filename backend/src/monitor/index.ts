import cron from 'node-cron';
import { runExpiryMonitor, runLowStockMonitor } from './inventoryMonitor';

export function startMonitor(): void {
  cron.schedule('0 0 * * *', () => {
    runExpiryMonitor().catch((err) =>
      console.error('[InventoryMonitor] Error in expiry cron:', err)
    );
  });

  cron.schedule('0 */6 * * *', () => {
    runLowStockMonitor().catch((err) =>
      console.error('[InventoryMonitor] Error in low-stock cron:', err)
    );
  });

  console.log('[InventoryMonitor] Inventory monitor started');
}
