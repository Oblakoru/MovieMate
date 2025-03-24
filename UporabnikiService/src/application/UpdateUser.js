const bcrypt = require("bcrypt");

class UpdateUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(id, { name, email, password }) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error("User not found.");
        }

        let passwordHash = existingUser.passwordHash;
        if (password) {
            passwordHash = await bcrypt.hash(password, 10);
        }

        return await this.userRepository.update(id, { name, email, passwordHash });
    }
}

module.exports = UpdateUser;