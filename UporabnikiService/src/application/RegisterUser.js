const bcrypt = require("bcrypt");

class RegisterUser {

    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(name, email, password) {
        const existingUser = await this.userRepository.findByEmail(email);
        
        if (existingUser) {
            throw new Error("Uporabnik s tem e-poštnim naslovom že obstaja.");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await this.userRepository.create({
            name,
            email,
            passwordHash
        });

        return newUser;
    }
}

module.exports = RegisterUser;