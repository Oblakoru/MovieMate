const bcrypt = require("bcrypt");

class RegisterUser {
    
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(name, email, password) {
        console.log("🔵 Registering user:", { name, email });

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            console.log("❌ User already exists:", existingUser);
            throw new Error("Uporabnik s tem e-poštnim naslovom že obstaja.");
        }

        console.log("✅ Hashing password...");
        const passwordHash = await bcrypt.hash(password, 10);
        
        const newUser = await this.userRepository.create({
            name,
            email,
            passwordHash
        });

        console.log("✅ User registered successfully:", newUser);
        return newUser;
    }
}

module.exports = RegisterUser;