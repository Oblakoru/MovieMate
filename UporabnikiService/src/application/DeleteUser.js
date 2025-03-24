class DeleteUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(id) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error("User not found.");
        }

        return await this.userRepository.delete(id);
    }
}

module.exports = DeleteUser;