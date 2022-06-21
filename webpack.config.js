require("dotenv").config();

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
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                ["@babel/preset-typescript", {}],
              ],
              plugins: [
                [
                  "transform-inline-environment-variables",
                  {
                    include: [
                      "NODE_ENV",
                      "GITHUB_CLIENT_ID",
                      "GITHUB_REDIRECT_URI",
                    ],
                  },
                ],
              ],
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
    new HtmlWebpackPlugin({
      publicPath: "/",
    }),
    new webpack.EnvironmentPlugin({ IS_GUTENBERG_PLUGIN: false }),
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
  },
  devServer: {
    historyApiFallback: {
      disableDotRule: true,
    },
    static: "./dist",
    port: process.env.PORT ?? 8080,
  },
};
