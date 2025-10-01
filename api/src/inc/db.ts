// 3rd party libs
import 'reflect-metadata/lite';

// Prisma client replacement for TypeORM data source
import { PrismaClient } from '../../generated/prisma';

// Inc
import { cmsConfig } from '@src/inc/cms-config';

export const prisma = new PrismaClient({
  log: ['error', 'warn']
});

// Initialize Prisma connection, set cmsConfig flag, and handle errors
async function initPrisma(): Promise<void> {
  try {
    await prisma.$connect();
    cmsConfig.dbLoaded = true;
    console.info('[DB] Prisma Client connected');
  } catch (error) {
    console.error('[DB] Connection error!');
    console.error(error);
    process.exit(1);
  }
}

initPrisma();

// Graceful shutdown handling
const shutdown = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.info('[DB] Prisma Client disconnected');
  } catch (err) {
    console.error('[DB] Error during prisma disconnect', err);
  }
};

process.on('SIGINT', async () => { await shutdown(); process.exit(0); });
process.on('SIGTERM', async () => { await shutdown(); process.exit(0); });
