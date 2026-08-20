/**
 * An in-process MongoDB for tests that must exercise real indexes, real
 * uniqueness violations and real upsert semantics.
 *
 * Those three things cannot be faked. A unique compound index either rejects a
 * duplicate or it does not, and a backfill either is idempotent against a real
 * server or only appears to be. Everything else in the suite continues to run
 * against fixtures — this is for the catalogue-ownership rules alone.
 *
 * Never points at a configured database. `mongodb-memory-server` starts a
 * throwaway instance on an ephemeral port and discards its storage on stop, so
 * no test can reach development or production data even by accident.
 */

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let server: MongoMemoryServer | null = null;

/**
 * How many `describe` blocks in this process still need the database.
 *
 * Reference-counted rather than a plain flag, because a single test file
 * commonly has several `describe` blocks that each start and stop it. Without
 * counting, the first block's `after` hook tears the server down while later
 * blocks are still running — which surfaces as tests being *cancelled* rather
 * than failing, and only under load, which is the worst way to find a bug.
 */
let users = 0;

/** A start already in flight, so concurrent callers await one boot. */
let starting: Promise<void> | null = null;

/**
 * Starts the in-memory server and connects Mongoose to it.
 *
 * Safe to call from several `describe` blocks: the first call boots it and the
 * rest join.
 */
export async function startTestDatabase(): Promise<void> {
  users += 1;

  if (server) return;

  starting ??= (async () => {
    server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri(), { dbName: "thriftchef-test" });
  })();

  await starting;
}

/** Releases one user's claim; the last one out shuts the server down. */
export async function stopTestDatabase(): Promise<void> {
  users = Math.max(0, users - 1);

  if (users > 0 || !server) return;

  await mongoose.disconnect();
  await server.stop();

  server = null;
  starting = null;
}

/**
 * Empties every collection without dropping indexes.
 *
 * Dropping the collections instead would silently discard the indexes under
 * test, and a test that no longer has a unique index will happily accept the
 * duplicate it exists to reject.
 */
export async function clearTestDatabase(): Promise<void> {
  const { db } = mongoose.connection;
  if (!db) return;

  const collections = await db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
}

/** Builds every registered model's indexes, as a migration would. */
export async function syncTestIndexes(): Promise<void> {
  await Promise.all(
    Object.values(mongoose.models).map((model) => model.createIndexes()),
  );
}
