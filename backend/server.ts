import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';


const { Pool } = pkg;
const app = express();
const port = 5000;
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
  user: 'devuser',
  host: 'db',
  database: 'my_db',
  password: 'devpassword',
  port: 5432,
});

/** Async handler for failing requests */
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/** GET Request */
app.get('/', asyncHandler(async (req: Request, res: Response) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.send(`Backend is LIVE! DB Time: ${dbRes.rows[0].now}</br></br></br>
      <form method="post" action="">
        <label for="msg">Enter Query:</label><br>
        <input type="text" id="msg" name="query" value="" placeholder="type here..." style="width:16rem;"> 
        <br><br>
        <button type="submit">send POST request</button>
      </form>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed!");
  }
}));

app.post('/', asyncHandler(async (req: Request, res: Response) => {
  console.log(`POST / ${req.body.query}`);
  const result = await pool.query(req.body.query);
  res.json(result);
}));


app.get('/flats', asyncHandler(async (req: Request, res: Response) => {
  console.log("GET /flats")
  const flats = await prisma.flat_d.findMany({
    orderBy: {id: "asc"}
  });
  res.json(flats);
}));

app.get('/vendors', asyncHandler(async (req: Request, res: Response) => {
  console.log("GET /vendors");
  const vendors = await prisma.vendor_d.findMany({
    orderBy: {id: "asc"}
  });
  res.json(vendors);
}));

app.get('/festivals', asyncHandler(async (req: Request, res: Response) => {
  const festivals = await prisma.festival_d.findMany({
    orderBy: {id: "asc"}
  });
  res.json(festivals);
}));

/** POST Requests */
app.post('/flats', asyncHandler(async (req: Request, res: Response) => {
  console.log("POST /flats");
  const { flat_number, owner_name, type, owner_type, mobile, email } = req.body;
  const newFlat = await prisma.flat_d.create({
    data: { flat_number, owner_name, type, owner_type, mobile, email }
  });
  res.status(201).json(newFlat);
}));

app.post('/vendors', asyncHandler(async (req: Request, res: Response) => {
  console.log("POST /vendors");
  const { name, mobile } = req.body;
  const newVendor = await prisma.vendor_d.create({
    data: { name, mobile }
  });
  res.status(201).json(newVendor);
}));

app.post('/festivals', asyncHandler(async (req: Request, res: Response) => {
  console.log("POST /festivals");
  const { name, date } = req.body;
  const newFestival = await prisma.festival_d.create({
    data: { name, date }
  });
  res.status(201).json(newFestival);
}));

/** DELETE Requests */
app.delete('/flats/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`DELETE /flats/${id}`)
  await prisma.flat_d.delete({
    where: {id: Number(id)}
  });
  res.json({ message: "Flat deleted Successfully" });
}));

app.delete('/vendors/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`DELETE /vendors/${id}`)
  await prisma.vendor_d.delete({
    where: {id: Number(id)}
  });
  res.json({ message: "Vendor deleted successfully" });
}));

app.delete('/festivals/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`DELETE /festivals/${id}`)
  await prisma.festival_d.delete({
    where: {id: Number(id)}
  });
  res.json({ message: "Festival deleted successfully" });
}));

// --- GLOBAL ERROR HANDLER ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

/** SERVER */
app.listen(port, async () => {
  console.log(`Backend ready at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  console.log("Closing prisma connection");
  await prisma.$disconnect();
  process.exit(0);
});