const fs = require('fs');
const startPoint = process.cwd() + '/bin/www';

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = function (env) {
    return function (port) {
        if (fs.existsSync(startPoint)) {
            var actualPort;
            if (isNumeric(port)) {
                actualPort = process.env.PORT = port;
            } else {
                actualPort = 3000;
            }

            console.log('Atos is starting in development mode on port '+ actualPort);
            process.env.NODE_ENV = env;
            require(startPoint);
        } else {
            console.log('Cannot detect a project')
        }
    }
}