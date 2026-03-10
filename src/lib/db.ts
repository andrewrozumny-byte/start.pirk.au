import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql/web";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  const isVercel = process.env.VERCEL === "1";

  if (tursoUrl && tursoToken) {
    // Turso (Vercel/serverless) — uses HTTP, no native deps
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken });
    return new PrismaClient({ adapter });
  }

  if (isVercel) {
    throw new Error(
      "On Vercel, set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Project Settings → Environment Variables. " +
        "See README → Deploy on Vercel."
    );
  }

  // Local SQLite (dev)
  const dbPath = path.join(process.cwd(), "pirk.db").replace(/\\/g, "/");
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
