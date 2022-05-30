const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: './client/index.js',
    output: { filename: 'bundle.js', path: path.resolve(__dirname, 'build'), publicPath: '/' },
    module: {
        rules: [
          {
            test: /\.jsx?/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env', '@babel/react'],
              plugins:  ['@babel/plugin-transform-runtime']
            },
          },
          {
            test: /\.s?css/, 
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
          },
        ],
    },
    plugins: [new HtmlWebpackPlugin({ 
      template: './client/index.html', 
      favicon: './build/myIcon.ico'})],
    devServer: {
        historyApiFallback: true,
        static: {
          publicPath: '/build',
          directory: path.resolve(__dirname, 'public')
        },
        proxy: {
            '/api': 'http://localhost:3000/',
        }
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    }
};