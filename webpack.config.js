var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, './public');
var APP_DIR = path.resolve(__dirname, './app');

module.exports = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },

  module : {
    rules : [
      {
        test : /\.jsx?/,
        exclude : '/node_modules/',
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  }

};
