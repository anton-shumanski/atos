import * as _ from 'lodash';
/**
 * 404 (Not Found) Handler
 *
 * Usage:
 * return res.notFound();
 * return res.notFound(err);
 * return res.notFound(err, view);
 */

module.exports = function notFound (err, view) {

    // Get access to `req` & `res`
    const req = this.req;
    const res = this;
    // Set status code
    res.status(404);

    let data = err;
    if (!_.isEmpty(data) && (!_.isObject(data) || err instanceof Error)) {
        data = {error: err};
    }

    if (req.wantsJson) {
        if (!data) {
            return res.send();
        } else {
            return res.json(err);
        }
    }

    res.render(view || '404', err);
};