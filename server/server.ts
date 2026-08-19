import "dotenv/config";
import { createApp } from "./app";
import { getConfig } from "./config/env";
import { connectToDatabase, disconnectFromDatabase } from "./db/connect";

async function main(): Promise<void> {
  const config = getConfig();

  // Fail before listening: a server that accepts traffic it cannot serve is
  // harder to diagnose than one that never starts.
  await connectToDatabase(config.mongodbUri);

  const server = createApp(config).listen(config.port, () => {
    console.log(
      JSON.stringify({
        level: "info",
        message: "thriftchef-api listening",
        port: config.port,
        nodeEnv: config.nodeEnv,
        mealPlanner: "local-engine",
      }),
    );
  });

  const shutdown = (signal: string): void => {
    console.log(JSON.stringify({ level: "info", message: "shutting down", signal }));

    server.close(() => {
      void disconnectFromDatabase().finally(() => process.exit(0));
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

void main().catch((error: unknown) => {
  // Startup failures are the one place a full message helps, and no user data
  // exists yet. Config errors already name variables without their values.
  console.error(
    JSON.stringify({
      level: "fatal",
      message: "thriftchef-api failed to start",
      detail: error instanceof Error ? error.message : String(error),
    }),
  );
  process.exitCode = 1;
});
