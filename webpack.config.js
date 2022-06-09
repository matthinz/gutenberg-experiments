const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const path = require("path");
const sass = require("sass");
const webpack = require("webpack");

module.exports = {
  devtool: "inline-source-map",
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve("./dist"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                implementation: sass,
                includePaths: ["./node_modules/@uswds/uswds/packages"],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
        ],
      },
      {
        test: /\.(svg|gif|jpg|png)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.EnvironmentPlugin({ IS_GUTENBERG_PLUGIN: false }),
  ],
  devServer: {
    static: "./dist",
  },
};
