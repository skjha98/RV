import { type Request, type Response } from 'express';
import { prisma } from '../lib/prisma.js';


export const createOccasion = async (req: Request, res: Response) => {
    const { name, date } = req.body;
    const newOccasion = await prisma.occasion_d.create({
        data: { name, date: new Date(date) }
    });
    res.status(201).json(newOccasion);
};

export const getOccasion = async (req: Request, res: Response) => {
    const occasions = await prisma.occasion_d.findMany({ orderBy: { id: "asc" } });
    res.json(occasions);
};

export const updateOccasion = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, date } = req.body;
    const updatedOccasion = await prisma.occasion_d.update({
        where: { id: Number(id) },
        data: { name, date: new Date(date) }
    });
    res.json(updatedOccasion);
};

export const deleteOccasion = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.occasion_d.delete({
        where: { id: Number(id) }
    });
    res.json({ message: `Deleted occasion id: ${id} successfully!` });
};

export const bulkCreateOccasions = async (req: Request, res: Response) => {
    const data = req.body.map((item: any) => {
        const [month, date, year] = item.date.split('/').map(Number);
        const dateObj = new Date(year, month - 1, date);
        return { ...item, date: dateObj };
    });

    const newOccasions = await prisma.occasion_d.createMany({
        data: data,
        skipDuplicates: true
    });
    res.status(201).json(newOccasions);
}