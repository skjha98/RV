import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';

const { Pool } = pkg;
const adapter = new PrismaPg(new Pool({
  connectionString: process.env.DATABASE_URL,
}));

export const prisma = new PrismaClient({ adapter });