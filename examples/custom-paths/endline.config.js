/**
 * By default, Endline looks for route files in the `./src/routes` directory;
 * this can be overridden in this configuration file.
 */
/** @type {import('endline').EndlineConfig} */
const config = {
  router: {
    routesDirectory: './src/api',
  },
}

module.exports = config
