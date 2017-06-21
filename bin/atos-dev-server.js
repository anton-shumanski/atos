#!/usr/bin/env babel-node
const program = require('../lib-es5/private/patched-commander');

var cmd;
// $ atos run
cmd = program.command('run');
cmd.usage('');
cmd.option('--port');
cmd.option('--silent');
cmd.action(require('./commands/server')('development'));

program.initHelp();
