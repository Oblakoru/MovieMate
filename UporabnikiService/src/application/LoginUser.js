const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class LoginUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email);
        
        if (!user || !user.passwordHash || !password) {
            throw new Error("Nepravilen e-poštni naslov ali geslo.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error("Nepravilen e-poštni naslov ali geslo.");
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT skrivni ključ ni nastavljen v okolju.");
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                name: user.name,
                role: user.role  // ✅ Add role to the token
            },
            secret,
            { expiresIn: "24h" }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role // ✅ Add role to response
            }
        };
    }
}

module.exports = LoginUser;
