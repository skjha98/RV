import 'dotenv/config';
import express, {type NextFunction, type Request, type Response} from 'express';
import pkg from 'pg';
import { prisma } from './lib/prisma.js';
import morgan from 'morgan';
import occasionRoutes from './routes/occasionRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import flatRoutes from './routes/flatRoutes.js';


const { Pool } = pkg;
const app = express();
const port = 5000;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
  user: 'devuser',
  host: 'db',
  database: 'my_db',
  password: 'devpassword',
  port: 5432,
});


/** GET Request */
app.get('/', async (req: Request, res: Response) => {
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
});

app.post('/', async (req: Request, res: Response) => {
  console.log(`POST / ${req.body.query}`);
  const result = await pool.query(req.body.query);
  res.json(result);
});

app.use('/flats', flatRoutes);
app.use('/vendors', vendorRoutes);
app.use('/occasions', occasionRoutes);


// --- GLOBAL ERROR HANDLER ---
app.use((err: any, req: any, res: any, next: any) => {
  console.error(`[ERROR] ${req.method} ${req.url}: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});


app.listen(port, async () => console.log(`Backend ready at http://localhost:${port}`));

process.on('SIGINT', async () => {
  console.log("Closing prisma connection");
  await prisma.$disconnect();
  process.exit(0);
});