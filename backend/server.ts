import express, { type Request, type Response } from 'express';
import pkg from 'pg';
const { Pool } = pkg;

// Rest of your code...

const app = express();
const port = 5000;

app.use(express.json());

const pool = new Pool({
    user: 'devuser',
    host: 'db', // Matches the service name in docker-compose
    database: 'my_db',
    password: 'devpassword',
    port: 5432,
});

const setupDb = async () => {
    // CREATE TYPE IF NOT EXISTS flat_type AS ENUM ('FLAT', 'DUPLEX');
    // CREATE TYPE IF NOT EXISTS flat_owner_type AS ENUM ('OWNER', 'TENANT');
    const setupQueries = `
    DO $$ BEGIN
        CREATE TYPE flat_type AS ENUM ('FLAT', 'DUPLEX');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
        CREATE TYPE flat_owner_type AS ENUM ('OWNER', 'TENANT');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS flat_d (
        id SERIAL PRIMARY KEY,
        flat_number TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        type flat_type NOT NULL,
        owner_type flat_owner_type,
        mobile CHAR(10),
        email TEXT
    );
    
    CREATE TABLE IF NOT EXISTS vendor_d (
        id SERIAL PRIMARY KEY,
        name TEXT,
        mobile CHAR(10)
    );

    CREATE TABLE IF NOT EXISTS festival_d (
        id SERIAL PRIMARY KEY,
        name TEXT,
        date DATE
    );
    `;
    try {
        pool.query(setupQueries);
        console.log("Executed")
    }
    catch(err) {
        console.log("FAILED");
    }
}

const populateDb = async () => {
    const insertQueies = `
    -- Insert dummy data into flat_d
    INSERT INTO flat_d (flat_number, owner_name, type, owner_type, mobile, email) VALUES
        ('A-101', 'Rajesh Kumar', 'FLAT', 'OWNER', '9876543210', 'rajesh.kumar@email.com'),
        ('A-102', 'Priya Sharma', 'FLAT', 'OWNER', '9876543211', 'priya.sharma@email.com'),
        ('A-103', 'Amit Patel', 'FLAT', 'TENANT', '9876543212', 'amit.patel@email.com'),
        ('A-201', 'Sunita Reddy', 'DUPLEX', 'OWNER', '9876543213', 'sunita.reddy@email.com'),
        ('A-202', 'Vikram Singh', 'DUPLEX', 'OWNER', '9876543214', 'vikram.singh@email.com'),
        ('A-203', 'Neha Gupta', 'FLAT', 'TENANT', '9876543215', 'neha.gupta@email.com'),
        ('B-101', 'Anand Desai', 'FLAT', 'OWNER', '9876543216', 'anand.desai@email.com'),
        ('B-102', 'Kavita Joshi', 'FLAT', 'TENANT', '9876543217', 'kavita.joshi@email.com'),
        ('B-103', 'Ramesh Nair', 'FLAT', 'OWNER', '9876543218', 'ramesh.nair@email.com'),
        ('B-201', 'Deepa Iyer', 'DUPLEX', 'OWNER', '9876543219', 'deepa.iyer@email.com'),
        ('B-202', 'Suresh Menon', 'DUPLEX', 'OWNER', '9876543220', 'suresh.menon@email.com'),
        ('B-203', 'Lakshmi Krishnan', 'DUPLEX', 'TENANT', '9876543221', 'lakshmi.krishnan@email.com'),
        ('C-101', 'Manoj Verma', 'FLAT', 'TENANT', '9876543222', 'manoj.verma@email.com'),
        ('C-102', 'Divya Choudhary', 'FLAT', 'OWNER', '9876543223', 'divya.choudhary@email.com'),
        ('C-103', 'Prakash Rao', 'FLAT', 'TENANT', '9876543224', 'prakash.rao@email.com'),
        ('C-201', 'Anjali Malhotra', 'DUPLEX', 'OWNER', '9876543225', 'anjali.malhotra@email.com'),
        ('C-202', 'Sanjay Gupta', 'DUPLEX', 'OWNER', '9876543226', 'sanjay.gupta@email.com'),
        ('C-203', 'Meera Nambiar', 'DUPLEX', 'TENANT', '9876543227', 'meera.nambiar@email.com'),
        ('D-101', 'Arjun Reddy', 'FLAT', 'OWNER', '9876543228', 'arjun.reddy@email.com'),
        ('D-102', 'Pooja Deshmukh', 'FLAT', 'TENANT', '9876543229', 'pooja.deshmukh@email.com'),
        ('D-201', 'Karthik Subramanian', 'DUPLEX', 'OWNER', '9876543230', 'karthik.s@email.com'),
        ('D-202', 'Shweta Nair', 'DUPLEX', 'TENANT', '9876543231', 'shweta.nair@email.com');

    -- Insert dummy data into vendor_d
    INSERT INTO vendor_d (name, mobile) VALUES
        ('Grocery Mart', '9988776655'),
        ('Fresh Vegetables', '9988776656'),
        ('Dairy Products', '9988776657'),
        ('Electrical Repairs', '9988776658'),
        ('Plumbing Services', '9988776659'),
        ('Cleaning Services', '9988776660'),
        ('Security Services', '9988776661'),
        ('Newspaper Delivery', '9988776662'),
        ('Milk Delivery', '9988776663'),
        ('Internet Provider', '9988776664'),
        ('Electricity Board', '9988776665'),
        ('Water Supply', '9988776666'),
        ('Maintenance Services', '9988776667'),
        ('Gardening Services', '9988776668'),
        ('Pest Control', '9988776669'),
        ('Cable TV Service', '9988776670'),
        ('Gas Cylinder', '9988776671'),
        ('Furniture Repair', '9988776672'),
        ('AC Service', '9988776673'),
        ('Car Wash', '9988776674');

    -- Insert dummy data into festival_d
    INSERT INTO festival_d (name, date) VALUES
        ('Diwali', '2024-11-01'),
        ('Holi', '2024-03-25'),
        ('Navratri', '2024-10-03'),
        ('Dussehra', '2024-10-12'),
        ('Ganesh Chaturthi', '2024-09-07'),
        ('Eid al-Fitr', '2024-04-10'),
        ('Christmas', '2024-12-25'),
        ('New Year', '2025-01-01'),
        ('Republic Day', '2024-01-26'),
        ('Independence Day', '2024-08-15'),
        ('Gandhi Jayanti', '2024-10-02'),
        ('Raksha Bandhan', '2024-08-19'),
        ('Janmashtami', '2024-08-26'),
        ('Makar Sankranti', '2024-01-15'),
        ('Pongal', '2024-01-15'),
        ('Onam', '2024-09-15'),
        ('Baisakhi', '2024-04-13'),
        ('Durga Puja', '2024-10-09'),
        ('Eid al-Adha', '2024-06-17'),
        ('Buddha Purnima', '2024-05-23'),
        ('Ram Navami', '2024-04-17'),
        ('Hanuman Jayanti', '2024-04-23'),
        ('Mahavir Jayanti', '2024-04-21'),
        ('Guru Nanak Jayanti', '2024-11-15'),
        ('Hemis Festival', '2024-07-10');
    `;
    try {
        pool.query(insertQueies);
        console.log("Data inserted");
    }
    catch(err) {
        console.log("Error inserting data");
    }
}

// Notice the : Request and : Response - this fixes your error!
app.get('/', async (req: Request, res: Response) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.send(`Backend is LIVE! DB Time: ${dbRes.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed!");
  }
});

app.get('/flats', async (req: Request, res: Response) => {
  console.log("GET /flats");
  const result = await pool.query('SELECT * FROM flat_d');
  res.json(result.rows);
});

app.get('/vendors', async (req: Request, res: Response) => {
  console.log("GET /vendors");
  const result = await pool.query('SELECT * FROM vendor_d');
  res.json(result.rows);
});

app.get('/festivals', async (req: Request, res: Response) => {
  console.log("GET /festivals");
  const result = await pool.query('SELECT * FROM festival_d');
  res.json(result.rows);
});

app.post('/flats', async (req: Request, res: Response) => {
  const { flat_number, owner_name, type, owner_type, mobile, email } = req.body;
  const result = await pool.query(
    'INSERT INTO flat_d (flat_number, owner_name, type, owner_type, mobile, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [flat_number, owner_name, type, owner_type, mobile, email]
  );
  res.json(result.rows[0]);
});

app.post('/vendors', async (req: Request, res: Response) => {
  const { name, mobile } = req.body;
  const result = await pool.query(
    'INSERT INTO vendor_d (name, mobile) VALUES ($1, $2) RETURNING *',
    [name, mobile]
  );
  res.json(result.rows[0]);
});

app.post('/festivals', async (req: Request, res: Response) => {
  const { name, date } = req.body;
  const result = await pool.query(
    'INSERT INTO festival_d (name, date) VALUES ($1, $2) RETURNING *',
    [name, date]
  );
  res.json(result.rows[0]);
});

// Delete a User
app.delete('/flats/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM flat_d WHERE id = $1', [id]);
  res.json({ message: "Flat deleted" });
});

// Delete a Project
app.delete('/vendors/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM vendor_d WHERE id = $1', [id]);
  res.json({ message: "Vendor deleted" });
});

// Delete a Task
app.delete('/festivals/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM festival_d WHERE id = $1', [id]);
  res.json({ message: "Festival deleted" });
});

app.listen(port, () => {
  setupDb();
//   populateDb();
  console.log(`Backend listening at http://localhost:${port}`);
});
