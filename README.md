# json-server-reset

> Reset middleware for json-server

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]
[![Cypress.io tests](https://img.shields.io/badge/cypress.io-tests-green.svg?style=flat-square)](https://cypress.io)
[![renovate-app badge][renovate-badge]][renovate-app]

## Install

Requires [Node](https://nodejs.org/en/) version 8 or above (because of `json-server@0.15` peer dependency).

```sh
npm install --save json-server-reset
```

## Use

If you are using [json-server](https://github.com/typicode/json-server), add this module as a middleware. For example, imagine our data file to be `data.json` with the following resources

```json
{
  "todos": []
}
```

Then load the file and this middleware

```
json-server data.json --middlewares ./node_modules/json-server-reset
```

Then you can work with "todos" and reset the datastore (I am using [httpie](https://httpie.org/) client in this examples)

```
$ http :3000/todos
[]
$ http POST :3000/todos text="do something"
{
    "id": 1,
    "text": "do something"
}
$ http POST :3000/todos text="do something else"
{
    "id": 2,
    "text": "do something else"
}
$ http :3000/todos
[
    {
        "id": 1,
        "text": "do something"
    },
    {
        "id": 2,
        "text": "do something else"
    }
]
```

Now reset the database back to the initial empty list of todos. Note `:=` syntax to send the JSON as a list, not as a string.

```
$ http POST :3000/reset todos:=[]
$ http :3000/todos
[]
```

### Debugging

Run this module with environment variable

```
DEBUG=json-server-reset
```

### Using in your own server

If you want to use `json-server-reset` when building your own server that includes `json-server`, make sure the to initialize it by passing `json-server` reference and router database reference, and to add `body-parser` middleware before the reset. This middleware is included with `json-server`

Then set it to be the middleware _before_ the rest of the `json-server` middlewares.

```js
const jsonServer = require('json-server')
const reset = require('json-server-reset')
const setApp = require('json-server-reset/src/set-app')
const bodyParser = require('json-server/lib/server/body-parser')

// create json server and its router first
const server = jsonServer.create()
const router = jsonServer.router(db)
// then pass it to json-server-reset
server.use(setApp(server, router.db))
server.use(bodyParser)
server.use(reset)
// the rest of middlewares
server.use(jsonServer.defaults())
server.use(router)
```

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2017

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/json-server-reset/issues) on Github

## MIT License

Copyright (c) 2017 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/json-server-reset.svg?downloads=true
[npm-url]: https://npmjs.org/package/json-server-reset
[ci-image]: https://travis-ci.org/bahmutov/json-server-reset.svg?branch=master
[ci-url]: https://travis-ci.org/bahmutov/json-server-reset
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
