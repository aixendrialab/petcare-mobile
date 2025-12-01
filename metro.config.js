const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Allow external static map images on Expo web
config.resolver.assetExts.push("svg", "png", "jpg", "jpeg", "gif");

config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = config;
