/**
 * A throwaway MongoDB for local work.
 *
 * Prisma needs a replica set, which a plain `mongod` on your machine is not.
 * This starts a single-node replica set in a temp directory, prints the
 * connection string, and holds it open until you stop the process.
 *
 *   node scripts/local-mongo.mjs
 *
 * Then, in another terminal, put the printed URI in DATABASE_URL and run
 * `npm run db:push && npm run db:seed`. Data is discarded on exit — this is for
 * development and CI, never for anything you want to keep.
 */

import { writeFileSync } from "node:fs";

import { MongoMemoryReplSet } from "mongodb-memory-server";

const replSet = await MongoMemoryReplSet.create({
  replSet: { count: 1, storageEngine: "wiredTiger" },
});

// getUri(dbName) puts the database in the path, before the replicaSet query.
const uri = replSet.getUri("the-maker");

writeFileSync(".local-mongo-uri", uri, "utf8");

console.log("\nMongoDB replica set is up.\n");
console.log(`  DATABASE_URL="${uri}"\n`);
console.log("Written to .local-mongo-uri. Ctrl-C to stop and discard the data.\n");

async function shutdown() {
  await replSet.stop();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
