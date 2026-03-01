import { type Request, type Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { cleanData } from '../utils/cleanData.js';


export const createFlat = async (req: Request, res: Response) => {
    const { flat_number, owner_name, type, owner_type, mobile, email } = req.body;
    const newFlat = await prisma.flat_d.create({
        data: { flat_number, owner_name, type, owner_type, mobile, email }
    });
    res.status(201).json(newFlat);
};

export const getFlats = async (req: Request, res: Response) => {
    const flats = await prisma.flat_d.findMany({ orderBy: { id: "asc" } });
    res.json(flats);
};

export const updateFlat = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { flat_number, owner_name, type, owner_type, mobile, email } = req.body;
    const updatedFlat = await prisma.flat_d.update({
        where: { id: Number(id) },
        data: { flat_number, owner_name, type, owner_type, mobile, email }
    });
    res.json(updatedFlat);
}

export const deleteFlat = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.flat_d.delete({
        where: { id: Number(id) }
    });
    res.json({ message: `Deleted flat id: ${id} successfully!` });
};

export const bulkCreateFlats = async (req: Request, res: Response) => {
    console.log("POST /flats/bulk");
    const data = req.body;
    data.forEach((row: any) => {
        cleanData(row);
    });
    const newFlats = await prisma.flat_d.createMany({
        data: data,
        skipDuplicates: true
    });
    res.status(201).json(newFlats);
}