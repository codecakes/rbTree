var compile6to5 = function compile6to5 () {
    var traceur = require('traceur');

    traceur.require.makeDefault(function(filename) {
      return filename.indexOf('node_modules') === -1;
    });
};

exports.compile6to5 = compile6to5;