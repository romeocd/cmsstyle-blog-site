//Helper function for user authentication
const withAuth = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect("/login");
    } else {
        next();
    }
};

module.exports = withAuth;