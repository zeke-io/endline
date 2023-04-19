# Getting Started Guide

Before getting started, you will need Node.js 14.17 or a newer version.

## Installation

Install Endline using your favorite package manager:

NPM:

```bash
npm install endline
```

Yarn:

```bash
yarn add endline
```

Pnpm:

```bash
pnpm add endline
```

Open your `package.json` and add the `dev` script:

```yaml
"scripts": {
  "dev": "endline dev"
}
```

Create the directory `src/api` at the root of your project, this is where Endline looks for endpoint routes.

However, you can change this by creating a configuration file `endline.config.js`.

```javascript
const config = {
  router: {
    apiFolderPath: 'src/routes',
  },
}

module.exports = config
```
