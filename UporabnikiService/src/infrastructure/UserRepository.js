const sqlite3 = require("sqlite3").verbose();

class UserRepository {
    
    constructor(dbPath = "users.db") {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error("Napaka pri povezavi z bazo:", err.message);
            } else {
                console.log("Povezava z SQLite uspešna.");
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
                createdAt TEXT
            )
        `);
    }

    async create(user) {
        return new Promise((resolve, reject) => {
            const { name, email, passwordHash } = user;
            this.db.run(
                `INSERT INTO users (name, email, passwordHash, createdAt) VALUES (?, ?, ?, ?)`,
                [name, email, passwordHash, new Date().toISOString()],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID, ...user });
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
}

module.exports = UserRepository;