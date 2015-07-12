var webpack = require('webpack');
var ejs = require('ejs');
var MIN = process.argv.indexOf('-p') > -1;

function getBanner() {
  var pkg = require('./bower.json');
  var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');
  return ejs.render(banner, {pkg: pkg});
}

module.exports = {
  entry: __dirname + '/src/angular-bootstrap-confirm.js',
  output: {
    path: __dirname + '/dist',
    filename: MIN ? 'angular-bootstrap-confirm.min.js' : 'angular-bootstrap-confirm.js',
    libraryTarget: 'umd'
  },
  externals: {
    angular: 'angular',
    'angular-sanitize': 'angular-sanitize',
    './ui-bootstrap-position': 'angular-bootstrap'
  },
  devtool: MIN ? 'source-map' : null,
  module: {
    preLoaders: [{
      test: /.*\.js$/,
      loaders: ['eslint'],
      exclude: /node_modules/
    }],
    loaders: [{
      test: /.*\.js$/,
      loaders: ['ng-annotate'],
      exclude: /node_modules/
    }]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.BannerPlugin(getBanner(), {
      raw: true,
      entryOnly: true
    })
  ]
};
