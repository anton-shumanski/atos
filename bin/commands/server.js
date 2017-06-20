const fs = require('fs');
const _ = require('lodash');
const startPoint = process.cwd() + '/bin/www';

module.exports = function (env) {
    return function (port) {
        if (fs.existsSync(startPoint)) {
            if (_.isNumber(port)) {
                process.env.NODE_PORT = port;
            }

            console.log('Atos is starting in development mode');
            process.env.NODE_ENV = env;
            require(startPoint);
        } else {
            console.log('Cannot detect a project')
        }
    }
}