import { prisma } from '../lib/prisma.js';

export const promoteStagedRevenue = async () => {
  return await prisma.$transaction(async (tx) => {
    const stagedData = await tx.revenue_stage_t.findMany();

    if (stagedData.length === 0) return { moved: 0 };

    const productionData = stagedData.map(({ id, ...rest }) => ({
      ...rest,
      created_at: new Date(),
    }));

    const created = await tx.revenue_t.createMany({
      data: productionData as any,
    });

    await tx.revenue_stage_t.deleteMany();

    return { moved: created.count };
  });
};