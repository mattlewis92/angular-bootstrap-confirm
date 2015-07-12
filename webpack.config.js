var open = require('open');
var karma = require('karma');

var PORT = 8000;
open('http://localhost:' + PORT);

karma.server.start({
  configFile: __dirname + '/karma.conf.js',
  autoWatch: true,
  singleRun: false
});

module.exports = {
  entry: __dirname + '/src/angular-bootstrap-confirm.js',
  devtool: 'source-map',
  output: {
    filename: 'angular-bootstrap-confirm.js'
  },
  module: {
    preLoaders: [{
      test: /.*\.js$/,
      loaders: ['eslint'],
      exclude: /node_modules/
    }]
  },
  devServer: {
    port: PORT,
    inline: true
  }
};
