import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL ?? process.env.MONGODB_URI;

if (!mongoUrl) {
  throw new Error("Missing MONGO_URL (or MONGODB_URI) env var");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectToDb(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUrl, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxIdleTimeMS: 30000,
        retryWrites: true,
        retryReads: true,
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

