/* authguard means to restrict route to authenticated users only */
const withAuth = (req, res, next) => {
    if(!req.session.user_id) {
        res.redirect('/login');
    }
    else {
        next();
    }
};

module.exports = withAuth;