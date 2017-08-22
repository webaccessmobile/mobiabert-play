var path    = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {},
  module: {
    loaders: [
      { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate!babel' },
      { test: /\.html$/, loader: 'html' },
      { test: /\.(scss|sass)$/, loader: 'style?insertAt=top!css!sass' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/, loader: 'file?name=assets/fonts/[name].[ext]' },
      { test: /\.(png|jpe?g|gif)$/, loader: 'file?name=assets/images/[name].[ext]' }
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, 'src/app/styles')]
  },
  plugins: [
    //Torna JQuery uma variável global
    new webpack.ProvidePlugin({'window.jQuery': 'jquery'}),
    
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      hash: true
    }),

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'src')) === -1;
      }
    })
  ]
};
