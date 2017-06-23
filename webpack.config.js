module.exports = {
    entry: './js/index.js',
    output: {
        filename: './build/bundle.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        port: 3000,
        inline: true
    },
    devtool: 'source-map'
};