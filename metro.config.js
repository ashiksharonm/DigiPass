const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable watchman to fix macOS permissions issue
config.watchFolders = [];
config.resolver = {
    ...config.resolver,
};
config.watcher = {
    ...config.watcher,
    watchman: {
        // Disable watchman
        deferStates: [],
    },
};

module.exports = config;
