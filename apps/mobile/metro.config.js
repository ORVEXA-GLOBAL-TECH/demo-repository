const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const sharedClient = path.resolve(projectRoot, '../../packages/api-client');

const config = getDefaultConfig(projectRoot);
config.watchFolders = [sharedClient];
config.resolver.extraNodeModules = { '@alleviare/api-client': path.join(sharedClient, 'src') };
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];

module.exports = config;
