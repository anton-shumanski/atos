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

    fsExtra.copy(__dirname+'/../../lib-es5/private/new/template', path, defaults).then(() => {
            process.chdir(path);
            npm.load(
                function(err) {
                    // handle errors

                    // install module ffi
                    npm.commands.install(['.'], function(er, data) {
                        if (er) {
                            return console.error(er);
                        }

                        console.log("");
                        console.log("Atos project is created successfully!");
                    });

                    npm.on('log', function(message) {
                        // log installation progress
                        console.log(message);
                    });
                });

        }).catch(err => {
            console.error(err)
        })

};