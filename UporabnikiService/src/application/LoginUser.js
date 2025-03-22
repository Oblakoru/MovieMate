const bcrypt = require("bcrypt");

class LoginUser {
    
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Nepravilen e-poštni naslov ali geslo.");
        }

        console.log("User found:", user); 
        console.log("Stored passwordHash:", user.passwordHash);
        console.log("Password entered:", password);

        if (!user.passwordHash || !password) {
            throw new Error("Nepravilen e-poštni naslov ali geslo.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash); 
        if (!isPasswordValid) {
            throw new Error("Nepravilen e-poštni naslov ali geslo.");
        }

        return user;  // Vrne userja zaenkrat namesto JWT
    }
}

module.exports = LoginUser;