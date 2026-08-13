import mongoose from "mongoose";

/**
 * Mongoose buffers queries until a connection is ready, so routes may be
 * registered before `connectToDatabase` resolves. The server still awaits it
 * at startup to fail fast on a bad connection string.
 */
export async function connectToDatabase(uri: string): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10_000,
  });
}

export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
