const { logger } = require('../utils/logger');

/**
 * Inventory service handling stock reservations.
 * BUG: Acquires DB connections without releasing on error paths.
 * BUG: Optimistic locking retry exhausts pool under contention.
 */
class InventoryService {
  constructor() {
    this.pool = {
      max: 50,
      min: 5,
      acquired: 0,
      // BUG: No idle timeout - connections held forever
      idleTimeoutMs: 0, // Disabled!
    };
  }

  /**
   * Reserve inventory for a checkout.
   * BUG: Retries 15 times on lock conflict, each retry holds a connection.
   */
  async reserveStock(sku, quantity) {
    const maxRetries = 15; // BUG: Too many retries - each holds a connection
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      this.pool.acquired++;

      try {
        const currentStock = await this.getStock(sku);

        if (currentStock < quantity) {
          this.pool.acquired--;
          return { reserved: false, reservationId: '' };
        }

        // Simulate optimistic lock update (can fail under contention)
        const success = await this.tryUpdateStock(sku, currentStock - quantity, currentStock);

        if (success) {
          return {
            reserved: true,
            reservationId: `res_${Date.now()}_${sku}`,
          };
        }

        // Lock conflict - retry
        lastError = new Error('Optimistic lock conflict on SKU reservation');
        // BUG: Doesn't release connection before retry!
      } catch (error) {
        lastError = error;
        // BUG: Connection not released in catch block
      }
      // BUG: Small delay but connection still held from pool
      await new Promise(r => setTimeout(r, 50));
    }

    // Only releases ONE connection after all retries
    this.pool.acquired--;
    logger.error(`Optimistic lock conflict on SKU reservation - ${maxRetries} retries exhausted`);
    throw new Error(`Optimistic lock conflict on SKU reservation - ${maxRetries} retries exhausted`);
  }

  /**
   * BUG: Long-running query without timeout.
   * Under load, these pile up and exhaust connections.
   */
  async getStock(sku) {
    // Simulates a potentially slow query with no statement_timeout
    // Write latency exceeded 2000ms for collection reservations
    return 100;
  }

  /**
   * Optimistic lock update - returns false on version mismatch.
   */
  async tryUpdateStock(sku, newQuantity, expectedVersion) {
    // Under high contention, this fails frequently
    return Math.random() > 0.3; // 30% chance of lock conflict
  }

  /**
   * Cache invalidation.
   * BUG: On cache invalidation storm, falls back to direct DB reads
   * which further exhausts the connection pool.
   */
  async invalidateCache(sku) {
    const cacheAvailable = Math.random() > 0.2;
    if (!cacheAvailable) {
      logger.error('Cache invalidation storm detected - fallback to direct DB reads');
      // This doubles DB load when cache is down!
    }
  }

  getPoolStatus() {
    const available = this.pool.max - this.pool.acquired;
    if (available === 0) {
      logger.error(`Database connection pool exhausted - 0 available connections`);
    }
    return {
      acquired: this.pool.acquired,
      max: this.pool.max,
      available,
    };
  }
}

module.exports = { inventoryService: new InventoryService() };
