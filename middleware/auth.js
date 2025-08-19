const requireAuth = (req, res, next) => {
    if (req.session?.userId) {
        next();
    } else {
        res.status(401).json({ message: 'Login required' });
    }
};

module.exports = { requireAuth };