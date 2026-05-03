import mongoose from "mongoose";

/**
 * Get MongoDB URI from environment variables
 */
const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;

if (!mongoUrl) {
  throw new Error("Missing MONGO_URL (or MONGODB_URI) environment variable");
}

/**
 * Force TypeScript to treat it as string after validation
 */
const safeMongoUrl: string = mongoUrl;

/**
 * Global cache type to prevent multiple connections in dev/hot reload
 */
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend global object
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

/**
 * Initialize cache if not already present
 */
const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

/**
 * Connect to MongoDB
 */
export async function connectToDb(): Promise<typeof mongoose> {
  // If already connected, return cached connection
  if (cached.conn) return cached.conn;

  // Create new connection promise if not exists
  if (!cached.promise) {
    cached.promise = mongoose.connect(safeMongoUrl, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}