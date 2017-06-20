const fsExtra = require('fs-extra');
const _ = require('lodash');
const npm = require('npm');

module.exports = function (path, options) {
    if (_.isEmpty(path)) {
        return console.error('The project name is required');
    }
    const defaults = {
        overwrite: options.overwrite || false,
        errorOnExist: true
    };

    fsExtra.copy(__dirname+'/../../lib/private/new/template', path, defaults, err => {
            if (err) {
                return console.error(err);
            }
        process.chdir(path);
        npm.load(
            function(err) {
            // handle errors

            // install module ffi
            npm.commands.install(['.'], function(er, data) {
                console.error(er);
            });

            npm.on('log', function(message) {
                // log installation progress
                console.log(message);
            });
        });
            console.log("Atos project is created successfully!");
        });

};