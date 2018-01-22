const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const jsEntry = "./src/javascripts/index.js";
const cssEntry = "./src/stylesheets/index.scss";

const env = process.env.NODE_ENV || "development";
const isProd = env === "production";

const outputDir = path.resolve(__dirname, "build");

const envConfig = require(`./config/${env}.js`);

let webpackConfig = {
  entry: ["babel-polyfill", jsEntry, cssEntry],
  output: {
    filename: isProd ? "app.[chunkhash].js" : "app.js",
    path: outputDir
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".json", ".scss"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: "css-loader"
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: loader => [require("autoprefixer")()]
              }
            },
            {
              loader: "sass-loader",
              options: {
                includePaths: ["node_modules"]
              }
            }
          ]
        })
      },
      {
        test: /\.(png|svg)$/,
        use: "file-loader?name=images/[name]-[hash].[ext]"
      },
      {
        test: /\.(eot|woff|woff2|ttf)$/,
        use: "file-loader?publicPath=./&name=fonts/[name]-[hash].[ext]"
      }
    ]
  },
  plugins: [
    new InterpolateHtmlPlugin({
      PUBLIC_URL: ""
    }),
    new CleanWebpackPlugin([outputDir]),
    new ExtractTextPlugin(isProd ? "style.[chunkhash].css" : "style.css"),
    new HtmlWebpackPlugin({
      favicon: "./public/favicon.ico",
      inject: true,
      template: "public/index.html"
    }),
    new webpack.DefinePlugin(envConfig)
  ],
  devServer: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://backend:3001"
      }
    },
    contentBase: "build",
    historyApiFallback: true
  }
};

if (env === "development") {
  webpackConfig.devtool = "inline-source-map";
}

module.exports = webpackConfig;
