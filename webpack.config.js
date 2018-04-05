var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './source/index.js',
    output: {
        path: __dirname + '/dist/assets',
        filename: 'bundle.js',
        publicPath: 'assets',
        sourceMapFilename: 'bundle.map',
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './source'),
        }
    },
    devtool: '#source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['env', 'stage-0', 'react']
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            warnings: false,
            mangle: true
        }),
    ]
};