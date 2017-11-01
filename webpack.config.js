/**
 * Created by AllenFeng on 2017/3/22.
 */
const path = require('path');
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        index: ["./src/app/index", "babel-polyfill", "./src/styles/content"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/assets/",
        filename: "[name].js",
        library: "TuoTuo",
        libraryTarget: "window",
        sourceMapFilename: "[file].map",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                include: [
                    path.resolve(__dirname, "src/app")
                ],
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],
                loaders: ["babel-loader","eslint-loader"]
            },
            {
                test: /\.(css|less)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader','less-loader']
                })
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "src/app")
        ],
        extensions: [".js", ".json", ".jsx", ".css", ".scss", ".less"],
        // alias: {
        //     'react': path.resolve(__dirname, "node_modules/react/dist/react"),
        //     'react-dom': path.resolve(__dirname, "node_modules/react-dom/dist/react-dom")
        // }
    }
    ,
    devtool: "source-map",
    devServer: {
        host:'127.0.0.1',
        port: 3023,
        contentBase: [path.resolve(__dirname, "src")],
        compress: true,
        historyApiFallback: true
    }
    ,
    stats: "errors-only",
    plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        filename: 'common.js'
    }), new webpack.ProvidePlugin({
        "React": "react",
        "ReactDOM": "react-dom",
        "_": "lodash",
        "classnames": "classnames"
    }), new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true
    })]
}