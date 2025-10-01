// 3rd party libs
import { address } from 'ip';

// Inc
import { prisma } from '@inc/db';

export async function log(log: {
    userId?: number,
    module?: string,
    type?: string,
    info?: string,
}): Promise<boolean> {
  log.module = (log.module || '').toLowerCase();

  await prisma.mo_logs.create({
    data: {
      module: log.module || '',
      type: log.type || '',
      date: new Date(),
      ip: address(),
      info: log.info || '',
      userId: log.userId ?? null
    }
  });

  return true;
}