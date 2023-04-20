# "Custom Paths" example

By default, Endline looks for route files in the `src/routes` directory,
but this can be overridden with a configuration file.

By creating a `endline.config.js` file in the root folder,
you can override default settings.

### Example

```js
module.exports = {
  router: {
    routesDirectory: 'src/api',
  },
}
```
