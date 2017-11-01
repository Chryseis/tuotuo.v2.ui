/**
 * Created by AllenFeng on 2017/4/28.
 */
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
                loader: "babel-loader"
            },
            {
                test: /\.(css|scss)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader', use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true
                        }
                    }, 'sass-loader']
                })
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
        extensions: [".js", ".json", ".jsx", ".css", ".scss", ".less"]
    },
    devtool: "source-map",
    stats: "errors-only",
    plugins: [new webpack.ProvidePlugin({
        "React": "react",
        "ReactDOM": "react-dom",
        "_": "lodash",
        "classnames": "classnames"
    }), new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        filename: 'common.js'
    }), new ExtractTextPlugin({filename: '[name].css', allChunks: true}), new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }), new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })]
}