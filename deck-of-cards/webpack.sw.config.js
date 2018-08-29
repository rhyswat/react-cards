/*
 Webpack configuration file (environment neutral).
*/

const path = require('path');

const SRC = path.resolve(__dirname, 'src');
const BUILD = path.resolve(__dirname, 'build');

module.exports = {
    entry: path.join(SRC, 'service-worker.js'),
    output: {
        path: path.join(BUILD),
        filename: 'service-worker.js',
    },
    mode: 'production', // Webpack4 flag
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },
    plugins: []
}