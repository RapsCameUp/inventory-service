/**
 * Database configuration for inventory-service.
 * BUG: Connection pool settings are misconfigured.
 * BUG: No write latency monitoring.
 */
module.exports = {
  uri: process.env.MONGODB_URI,
  options: {
    maxPoolSize: 50,
    minPoolSize: 5,
    // BUG: No connection timeout - hangs forever if DB is slow
    connectTimeoutMS: 0, // Disabled!
    // BUG: No socket timeout
    socketTimeoutMS: 0, // Disabled!
    // BUG: Server selection timeout too high
    serverSelectionTimeoutMS: 30000, // 30s - should be 5s
    // BUG: No idle time configured - connections never recycled
    maxIdleTimeMS: 0, // Disabled!
  },
};
