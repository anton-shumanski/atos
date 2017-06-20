import passport from 'passport';

export class Authenticate{
    constructor() {
        Authenticate.prototype.handle = passport.authenticate('local', {
            successReturnToOrRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        });
    }
}
