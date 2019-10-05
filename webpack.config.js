const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: process.env.NODE_ENV || "development",
    entry: {
        index:"./frontend/src/index.tsx"
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', 'scss']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'js/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: { happyPackMode: true } 
                    },
                ],
                exclude: path.resolve(process.cwd(), 'node_modules'),
                include: path.resolve(process.cwd(), 'frontend/src')
            },
            {
                test: /\.scss$/,
                use: 'sass-loader'
            },
            {
                test: /\.css$/,
                use: 'css-loader'
            },
            {
                test:  /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("stylesheet/styles.css"),
        new HtmlWebpackPlugin({
            template: "frontend/src/pages/index.html"
          })
      ]
}
