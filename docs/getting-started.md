# Getting Started

Before getting started, you will need to install Node.js v16.20 or a newer version.
But it is recommended you use at least the current LTS version of Node.

## Creating a new project

We recommend using `create-endline-app`,
it will create the necessary files
and install the dependencies required to get you started quick without any manual configuration or installation.

You can create a new project with `create-endline-app` by running:

```bash
# NPX
npx create-endline-app@latest
# Yarn
yarn create endline-app
# PNPM
pnpm create endline-app
```

When running the command without arguments, `create-endline-app` will prompt you with some questions on how you want to set up your new project.

### Manual Installation

Install Endline using your favorite package manager:

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

Create the directory `src/routes` at the root of your project, this is where Endline looks for routes.
However, you can change this by creating a configuration file `endline.config.js`, and changing the path of the `routes` directory.

```javascript
/** @type {import('endline').EndlineConfig} */
const config = {
  router: {
    routesDirectory: './src/api',
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
