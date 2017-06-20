import passport from 'passport';
import {Strategy} from 'passport-local';
import crypto from 'crypto';

module.exports = function (app) {

	const modelPath = '../models/db/main';
	app.use(function(req, res, next) {
				// Configure the local strategy for use by Passport.
				//
				// The local strategy require a `verify` function which receives the credentials
				// (`username` and `password`) submitted by the user.  The function must verify
				// that the password is correct and then invoke `cb` with a user object, which
				// will be set at `req.user` in route handlers after authentication.
				passport.use(new Strategy({
							passReqToCallback : true
						},
						function(req, username, password, cb) {
							const models = require(modelPath);

							models().User.findOne({
								where: {
									email: username,
									password: crypto.createHash('md5').update(password).digest("hex")
								}
							}).then(user => {
								if (!user) {
									return cb(null, false, req.flash('error','Invalid username or password'));
								}

								return cb(null, user);
							}).catch(err => {
								return cb(err);
							});
						}));


				// Configure Passport authenticated session persistence.
				//
				// In order to restore authentication state across HTTP requests, Passport needs
				// to serialize users into and deserialize users out of the session.  The
				// typical implementation of this is as simple as supplying the user ID when
				// serializing, and querying the user record by ID from the database when
				// deserializing.
				passport.serializeUser(function(user, cb) {
					cb(null, user.id);
				});

				passport.deserializeUser(function(id, cb) {

					const models = require(modelPath);
					models().User.findById(id)
							.then(user => {
								if (!user) {
									return cb(null, false, req.flash('error','Invalid username or password'));
								}

								return cb(null, user);
							}).catch(err => {
						return cb(err);
					});
				});
				return next();
			},
			passport.initialize(),
			passport.session()
	);
}
