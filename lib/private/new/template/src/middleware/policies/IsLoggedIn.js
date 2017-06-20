export class IsLoggedIn {
    handle(req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            req.flash('warning', 'You do not have an access to this resource. Plese logged in first!')
            return res.redirect('/login');
        }
        next();
    }
}
