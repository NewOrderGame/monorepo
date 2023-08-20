module.exports = {
  jest: function (config) {
    config.transformIgnorePatterns = ['/node_modules/(?!axios).+\\.js$'];
    return config;
  }
};
