module.exports = {
    devtool: 'source-map',
    entry: './client/index.tsx',
    mode: 'development',
    output: {
        filename: './app.js'
    },
    resolve: {
        extensions: ['.Webpack.js', '.web.js', '.ts', '.js', '.tsx', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader'
                }
            }
        ]
    }
}