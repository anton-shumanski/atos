/**
 * 400 (Bad Request) Handler
 */

module.exports = function badRequest (message, code, fields, extraData) {

    // Set status code
    this.status(400);
    this.send({
        error : {
            message   : message || 'Request could not be handled.',
            code      : code || undefined,
            fields    : fields || undefined,
            extraData : extraData || undefined
        }
    });
};