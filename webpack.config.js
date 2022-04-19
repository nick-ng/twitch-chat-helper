import HtmlWebpackPlugin from "html-webpack-plugin";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const siteTitle = "Twitch Chat Helper";

export default {
  devServer: {
    open: true,
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 26164,
    historyApiFallback: true,
  },
  mode: process.env.NODE_ENV || "production",
  devtool: process.env.NODE_ENV !== "production" ? "source-map" : undefined,
  entry: "./src/entry.jsx",
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      { test: /\.css$/, use: "style-loader" },
      {
        test: /\.css$/,
        use: {
          loader: "css-loader",
          options: {
            modules: {
              mode: "local",
              localIdentName: "[path][name]_[local]-[hash:base64:7]",
            },
          },
        },
      },
      {
        test: /\.m?js(x?)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
            plugins: [
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-proposal-class-properties",
              "@babel/transform-runtime",
              "@babel/plugin-proposal-optional-chaining",
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: siteTitle,
      favicon: `${__dirname}/favicon.ico`,
      template: "./index.html",
      inject: true,
    }),
  ],
};
