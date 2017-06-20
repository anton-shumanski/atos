const framework = require('atos');

// Ensure we're in the project directory, so relative paths work as expected
// no matter where we actually run from.
process.chdir(__dirname);

// Ensure a framework can be located:
(function(module) {
    const atos = new framework.Atos();
    module.exports = atos.app;
    atos.setRouterPath(atos.app.get('sourcePath') + 'routes/Router');
    atos.setSchedulerPath(atos.app.get('sourcePath') + 'console/scheduler');
    atos.run();

})(module);