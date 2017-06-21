#!/usr/bin/env node
const program = require('../lib-es5/private/patched-commander');
const packageJson = require('../package.json');
const _ = require('lodash');

var NOOP = function() {};

program
    .version(packageJson.version, '-v, --version');


//
// Normalize version argument, i.e.
//
// $ atos -v
// $ atos -V
// $ atos --version
// $ atos version
//


// make `-v` option case-insensitive
process.argv = _.map(process.argv, function(arg) {
    return (arg === '-V') ? '-v' : arg;
});


// $ atos version (--version synonym)
program
    .command('version')
    .description('')
    .action(program.versionInformation);



program
    .unknownOption = NOOP;
program.usage('[command]');

var cmd;
// $ atos new <appname>
cmd = program.command('new [path_to_new_app]');
cmd.usage('[path_to_new_app]');
cmd.option('--overwrite');
cmd.unknownOption = NOOP;
cmd.description('Create new project');
cmd.action(require('./commands/new'));

program.initHelp();