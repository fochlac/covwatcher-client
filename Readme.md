# abstract-express-router

[![codecov](https://codecov.io/gh/fochlac/abstract-express-router/branch/master/graph/badge.svg)](https://codecov.io/gh/fochlac/abstract-express-router) [![CircleCI](https://circleci.com/gh/fochlac/abstract-express-router.svg?style=svg)](https://circleci.com/gh/fochlac/abstract-express-router) [![npm](https://img.shields.io/npm/v/abstract-express-router.svg?style=svg)](https://www.npmjs.com/package/abstract-express-router)

An framework for [express.js](https://github.com/visionmedia/express) which abstracts much of the syntax needed for creating an express-router while keeping the core-functionality. This allows for a quick and clean creation of routers in a single file without writing repetitive code. It also provides simple validation functionality for path and query parameters and for the body.

-   [Installation](#installation)
-   [Documentation](#documentation)
-   [Changelog](#changelog)
-   [License](#license)

## Installation

```
npm install abstract-express-router
```

Also make sure that you have Node.js 10 or newer in order to use it.

## Documentation

The main functionality is the creation of a router. For this it is necessary to create a Javascript object reflecting the structure of your api via string - object - pairs. Certain key names are restricted as they refer to [specific functionality](#reserved-key), but every other key will resolve into a seperate router instance with anything placed into the object mapped to its key value. It is possible to have multiple url-segments in a single key and it is also possible to use path parameters (e.g. "objects/:id").

### Reserved Keys

The reserved keys are the following:

#### Action verbs: get, post, put, delete

> Using an action verb will cause the creation of an endpoint. Each endpoint has the required key [controller](#controller) and allows for [middleware](#middleware) and [body, query, params](#validation)

#### Controller

> Controllers are required keys for every [endpoint](#action-verbs-get-post-put-delete). They have to be a function and to terminate the request.

#### Middleware

> Middleware is defined as an array of functions. They can be added in any layer.

#### Static

> Static is a shorthand for express static routing and requires the source path for the static files as value. This keyword can be used in any layer except endpoints.

#### Validation

> body, query and params allow for verification. body and query are restricted to [endpoints](#action-verbs-get-post-put-delete), but params can be used on any layer. Validation can be done either by using one of the [provided validators](#validators), or by passing a evaluation function which returns a boolean. It is possible to have multiple layers of objects for the validation. A failed validation for params will cause express to skip to the next router, while a failed validation for query and body terminates the request with error code 400.

### Validators

This library provides some convenience functions for triggering the validation:

#### regexpValidator

This Validator will evaluate the value against the provided regular expression.
`const number = regexpValidator(/^[a-z]{0,25}$/)`

#### oneOfValidator

This Validator will evaluate whether the value is part of the provided list.
`const repository = oneOfValidator(['test', 'foo'])`

### Order of application

1. Validation
2. Middleware
3. Action Verbs
4. Subrouters
5. Static
6. CatchAll

### Configuration

#### logger

It is possible to pass a function in the configuration object. If this is done any logging will be passed into this function, split into the loglevel and the message.

#### logLevel

This library provides 4 log levels:
0 - silent, 1 - error, 2 - warning, 3 - info

#### useCatchAll

Whether to use the default catchAll returning a 404 error.

## Example

```
import {createRouter, oneOfValidator, regexpValidator } from 'abstract-express-router'
import { createServer } from 'http'

const testMiddleware = testMiddleware2 = testMiddleware3 = (req, res, next) => {
	// do whatever
 	next()
}

// different types of validators
const number = regexpValidator(/^[a-z]{0,25}$/)
const repository = oneOfValidator(['test', 'foo'])
const id = regexpValidator(/^[0-9]{0,10}$/)
const report = (value) => value === 'report'

// handler
const handler1 = handler2 = (req, res) => res.status(200).send('hello')

const api = {
	middleware: [testMiddleware],
	api: {
		endpoint1: {
			middleware: [testMiddleware2],
			post: {
				body: { branch, report, repository },
				controller: handler1,
			},
		},
		endpoint2: {
			':id': {
				params: { id },
				put: {
					middleware: [testMiddleware3],
					body: {
						report,
						base: branch,
						repository,
					},
					controller: handler2,
				},
			},
		},
	},
	static: './path/of/static/content/'
}

const settings = {
	logger,
	logLevel: 2,
	useCatchAll: false
}

const app = createRouter(api, settings)
app.use(*, (req, res) => res.status(404).send('No luck here, try elsewhere!))

const server = createServer(app)

server.listen(8080)
```

## Changelog

10.04.2019: added static router

## License

[ISC License](License.md)
