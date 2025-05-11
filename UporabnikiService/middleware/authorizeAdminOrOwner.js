function authorizeAdminOrOwner(req, res, next) {
    const { user } = req;
    const { id } = req.params;

    console.log(user)
    console.log(id)


    if (user.role === "admin" || user.userId == id) {
        next();
    } else {
        res.status(403).json({ error: "Access denied." });
    }
}

module.exports = authorizeAdminOrOwner;
