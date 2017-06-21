#!/usr/bin/env node
const program = require('../lib-es5/private/patched-commander');

var cmd;
// $ atos run
cmd = program.command('run');
cmd.option('--port');
cmd.option('--silent');
cmd.action(require('./commands/server')('production'));

program.initHelp();