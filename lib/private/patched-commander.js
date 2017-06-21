const program = require('commander');
const _ = require('lodash');

//
//
// Monkey-patch commander
//
//

// Override the `usage` method to always strip out the `*` command,
// which we added so that `Atos someunknowncommand` will output
// the Atos help message instead of nothing.
var usage = program.Command.prototype.usage;
program.Command.prototype.usage = program.usage = function( /* str */ ) {
  program.commands = _.reject(program.commands, {
    _name: '*'
  });
  return usage.apply(this, Array.prototype.slice.call(arguments));
};

// Force commander to display version information.
program.Command.prototype.versionInformation = program.versionInformation = function() {
  program.emit('version');
};

// Force commander to display version information.
program.Command.prototype.initHelp = function() {
  var NOOP = function() {};
  var cmd;

 // $ atos help (--help synonym)
  cmd = program.command('help [command]');
  cmd.description('');
  cmd.action(function(){
    if (program.args.length > 1 && _.isString(program.args[0])) {
      var helpCmd = _.find(program.commands, {_name: program.args[0]});
      if (helpCmd) {
        helpCmd.help();
        return;
      }
    }
    program.help();
  });


  // $ atos <unrecognized_cmd>
  // Output atos help when an unrecognized command is used.
  program
      .command('*')
      .action(function(cmd){
        console.log('\n  ** Unrecognized command:', cmd, '**');
        program.help();
      });



  // Don't balk at unknown options
  program.unknownOption = NOOP;



  // $ atos
  //
  program.parse(process.argv);
  var NO_ARGS_SPECIFIED = program.args.length === 0;
  var NO_COMMAND_SPECIFIED = process.argv.length <= 2;
  if (NO_COMMAND_SPECIFIED && NO_ARGS_SPECIFIED) {
    program.help();
  }
};

module.exports = program;
