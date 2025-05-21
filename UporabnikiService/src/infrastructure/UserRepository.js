/* const sqlite3 = require("sqlite3").verbose();

class UserRepository {
    constructor(dbPath = process.env.NODE_ENV === "test" ? "test.db" : "users.db") {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error("Napaka pri povezovanju na podatkovno bazo:", err.message);
            } else {
                console.log("Povezava na podatkovno bazo uspešna.");
            }
        });
        this.initializeDatabase();
    }

    initializeDatabase() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                passwordHash TEXT,
                role TEXT DEFAULT 'user',
                createdAt TEXT
            )
        `);
    }

    async create(user) {
        return new Promise((resolve, reject) => {
            const { name, email, passwordHash, role = 'user' } = user;
            const createdAt = new Date().toISOString();

            this.db.run(
                `INSERT INTO users (name, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)`,
                [name, email, passwordHash, role, createdAt],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID, name, email, role, createdAt });
                }
            );
        });
    }

    async findByEmail(email) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    async findAll() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM users`, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    async update(id, user) {
        return new Promise((resolve, reject) => {
            const { name, email, passwordHash, role } = user;

            this.db.run(
                `UPDATE users SET name = ?, email = ?, passwordHash = ?, role = ? WHERE id = ?`,
                [name, email, passwordHash, role, id],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id, ...user });
                }
            );
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
                if (err) return reject(err);
                resolve({ message: "User deleted successfully." });
            });
        });
    }
}

module.exports = UserRepository;
 */

const { Pool } = require('pg');

class UserRepository {
    constructor() {
        this.pool = new Pool({
            user: process.env.PGUSER || 'root',
            host: process.env.PGHOST || 'root',
            database: process.env.PGDATABASE || 'MovieMate',
            password: process.env.PGPASSWORD || 'root',
            port: process.env.PGPORT || 5432,
        });

        this.initializeDatabase();
    }

    async initializeDatabase() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT UNIQUE,
                passwordHash TEXT,
                role TEXT DEFAULT 'user',
                createdAt TIMESTAMPTZ DEFAULT NOW()
            )
        `;

        await this.pool.query(createTableQuery);
    }

    async create(user) {
        const { name, email, passwordHash, role = 'user' } = user;
        const createdAt = new Date().toISOString();

        const query = `
            INSERT INTO users (name, email, passwordHash, role, createdAt)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, role, createdAt
        `;

        const values = [name, email, passwordHash, role, createdAt];
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async findByEmail(email) {
        const result = await this.pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );
        return result.rows[0];
    }

    async findById(id) {
        const result = await this.pool.query(
            `SELECT * FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async findAll() {
        const result = await this.pool.query(`SELECT * FROM users`);
        return result.rows;
    }

    async update(id, user) {
        const { name, email, passwordHash, role } = user;
        const query = `
            UPDATE users
            SET name = $1, email = $2, passwordHash = $3, role = $4
            WHERE id = $5
            RETURNING *
        `;

        const values = [name, email, passwordHash, role, id];
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async delete(id) {
        await this.pool.query(`DELETE FROM users WHERE id = $1`, [id]);
        return { message: "User deleted successfully." };
    }
}

module.exports = UserRepository;
