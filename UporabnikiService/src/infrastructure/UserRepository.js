const sqlite3 = require("sqlite3").verbose();

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
