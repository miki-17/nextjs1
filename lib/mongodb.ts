/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose, { Connection } from "mongoose";

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}


let cached: MongooseCache = (global as any).mongooseCache;

if (!cached) {
  cached = { conn: null, promise: null };
  (global as any).mongooseCache = cached;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

export async function connectToDatabase(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
