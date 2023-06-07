# "HTTP Status Codes" Example

Endline will use the returned object as the body of the response,
set the status code to `200`,
and apply the appropriate `Content-Type` header.

```js
// Content-Type: 'text/plain'
return 'string'

// Content-Type: 'application/json'
return {
  message: 'Hello',
}
```

However,
you can customize the response by returning an object and adding a `body` property.

By adding the `body` property,
Endline will treat the object as an [`EndlineResponse`](https://github.com/zeke-io/endline/blob/master/packages/endline/src/server/router/handler-types.ts#L4) object.

```js
// The 'body' is required so the status code and headers can be customized,
// However, the 'status' and 'headers' property are optional
return {
  // Endline will set the appropriate 'Content-Type' header
  // unless it is already specified in the 'headers' property
  body: JSON.stringify({ message: 'Hello' }),
  status: 418,
  headers: {
    'Content-Type': 'text/plain',
  },
}
```

This example project was created with [`create-endline-app`](https://github.com/zeke-io/endline/tree/master/packages/create-endline-app)
