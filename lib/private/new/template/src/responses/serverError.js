/**
 * 500 (Server Error) Handler
 */

module.exports = function serverError(err) {
    // Get access to `req` & `res`
    const req = this.req;
    const res = this;

    // Set status code
    res.status(500);

    res.locals.message = err.message || 'We\'re sorry, a server error occurred. Please wait a bit and try again.';
    res.locals.error = req.app.get('isProduction') ? {} : err;

    this.render('error', err);
}