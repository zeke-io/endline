# Getting Started Guide

Before getting started, you will need Node.js 14.17 or a newer version.

## Installation

Install Endline using your favorite package manager:

NPM:

```bash
# NPM
npm install endline
# Yarn
yarn add endline
# PNPM
pnpm add endline
```

Open your `package.json`, and add a `dev` and `build` script:

```yaml
"scripts": {
  "dev": "endline dev",
  "build": "endline build"
}
```

Create the directory `src/routes` at the root of your project, this is where Endline looks for endpoint routes.
However, you can change this by creating a configuration file `endline.config.js`, and changing the path of the `routes` directory from the root folder.

### Example

```javascript
const config = {
  router: {
    routesDirectory: 'src/api',
  },
}

module.exports = config
```

## Creating routes

Create a javascript file in the `routes` directory.
The name of the file will be used to map the router.

For example, if the name is `projects.js`, the router will be mapped to `/projects`,
however if you rename it to `index.js`, then it will be mapped to the base url `/`. 

```js
/**
 * Endline will look for a default exported function,
 * where you can set up the endpoints of each router.
 * 
 * @param {import('endline').Router} router
 */
export default function (router) {
  /** Set up endpoints */
  // GET /ping
  router.GET('/ping', async () => {
    return { message: 'Pong' }
  })
}
```
