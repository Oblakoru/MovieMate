class User {
    constructor(id, name, email, passwordHash, createdAt = new Date()) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
    }
}

module.exports = User;