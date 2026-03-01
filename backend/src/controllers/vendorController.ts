import { type Request, type Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { cleanData } from '../utils/cleanData.js';


export const createVendor = async (req: Request, res: Response) => {
    const { name, mobile } = req.body;
    const newVendor = await prisma.vendor_d.create({
        data: { name, mobile }
    });
    res.status(201).json(newVendor);
};

export const getVendor = async (req: Request, res: Response) => {
    const vendors = await prisma.vendor_d.findMany({ orderBy: { id: "asc" } });
    res.json(vendors);
};

export const updateVendor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, mobile } = req.body;
    const updatedVendor = await prisma.vendor_d.update({
        where: { id: Number(id) },
        data: { name, mobile }
    });
    res.json(updatedVendor);
};

export const deleteVendor = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.vendor_d.delete({
        where: { id: Number(id) }
    });
    res.json({ message: `Deleted vendor id: ${id} successfully!` });
};

export const bulkCreateVendors = async (req: Request, res: Response) => {
    const data = req.body;
    data.forEach((row: any) => {
        cleanData(row);
    })
    const newVendors = await prisma.vendor_d.createMany({
        data: data,
        skipDuplicates: true
    });
    res.status(201).json(newVendors);
}