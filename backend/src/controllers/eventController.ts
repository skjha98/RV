import { type Request, type Response } from 'express';
import { prisma } from '../lib/prisma.js';


export const createEvent = async (req: Request, res: Response) => {
    const { name, date } = req.body;
    const newEvent = await prisma.event_d.create({
        data: { name, date: new Date(date) }
    });
    res.status(201).json(newEvent);
};

export const getEvent = async (req: Request, res: Response) => {
    const events = await prisma.event_d.findMany({ orderBy: { id: "asc" } });
    res.json(events);
};

export const updateEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, date } = req.body;
    const updatedEvent = await prisma.event_d.update({
        where: { id: Number(id) },
        data: { name, date: new Date(date) }
    });
    res.json(updatedEvent);
};

export const deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.event_d.delete({
        where: { id: Number(id) }
    });
    res.json({ message: `Deleted event id: ${id} successfully!` });
};

export const bulkCreateEvents = async (req: Request, res: Response) => {
    const data = req.body.map((item: any) => {
        const [month, date, year] = item.date.split('/').map(Number);
        const dateObj = new Date(year, month - 1, date);
        return { ...item, date: dateObj };
    });

    const newEvents = await prisma.event_d.createMany({
        data: data,
        skipDuplicates: true
    });
    res.status(201).json(newEvents);
}