import Database from 'better-sqlite3';

const db = new Database('donors.db');

// Create donors table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS donors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    bloodGroup TEXT NOT NULL,
    city TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export const insertDonor = (donor: Omit<Donor, "id">) => {
  const stmt = db.prepare(`
    INSERT INTO donors (name, phone, email, bloodGroup, city)
    VALUES (@name, @phone, @email, @bloodGroup, @city)
  `);
  return stmt.run(donor);
};

export const getAllDonors = () => {
  const stmt = db.prepare('SELECT * FROM donors ORDER BY createdAt DESC');
  return stmt.all();
};

export const getDonorsByBloodGroup = (bloodGroup: string) => {
  const stmt = db.prepare('SELECT * FROM donors WHERE bloodGroup = ?');
  return stmt.all(bloodGroup);
};

export const getDonorsByCity = (city: string) => {
  const stmt = db.prepare('SELECT * FROM donors WHERE city LIKE ?');
  return stmt.all(`%${city}%`);
};

export default db;