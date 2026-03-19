import { type Request, type Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { promoteStagedRevenue } from '../utils/revenueUtils.js';

export const getStagedRevenue = async (req: Request, res: Response) => {
  const data = await prisma.revenue_stage_t.findMany();
  res.json(data);
};

export const confirmPromotion = async (req: Request, res: Response) => {
  const result = await promoteStagedRevenue();
  res.json({ message: "Promotion successful", count: result.moved });
};

export const getRevenue = async (req: Request, res: Response) => {
  const data = await prisma.revenue_t.findMany();
  res.json(data);
}

export const getRevenueAll = async (req: Request, res: Response) => {
  const data = await prisma.revenue_t.findMany({
    include:{flat:true, vendor:true, event:true}
  });
  res.json(data);
}
