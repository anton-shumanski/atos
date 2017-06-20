#!/usr/bin/env babel-node
const program = require('../lib/private/patched-commander');

let cmd;
// $ atos run
cmd = program.command('run');
cmd.option('--port');
cmd.action(require('./commands/server')('development'));

program.initHelp();