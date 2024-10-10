// Middleware to validate name field in request body
function validateName(req, res, next) {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "Name is required" });
    }

    next(); // If validation passes, move to the next middleware/route handler
}

module.exports = validateName;