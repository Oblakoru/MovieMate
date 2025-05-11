function authorizeAdmin(req, res, next) {
    if (req.user.role === "admin") {
        return next();
    }
    res.status(403).json({ error: "Admin access required." });
}

module.exports = authorizeAdmin;

