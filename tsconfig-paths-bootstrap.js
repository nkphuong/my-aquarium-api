const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');
const path = require('path');

const baseUrl = path.resolve(__dirname, tsConfig.compilerOptions.baseUrl || './src');

tsConfigPaths.register({
  baseUrl: baseUrl,
  paths: tsConfig.compilerOptions.paths || {}
});
