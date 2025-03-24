const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
        
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                name: user.name
            },
            "your-secret-key", // Hard-coded skrivni ključ za zdaj
            { expiresIn: '24h' }
        );
        
        console.log("✅ JWT token generated successfully");
        
        // Vrnemo žeton in osnovne podatke o uporabniku (brez gesla)
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }
}

module.exports = LoginUser;