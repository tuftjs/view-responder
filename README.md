# View Responder

![CI](https://github.com/tuftjs/view-responder/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/tuftjs/view-responder/badge.svg)](https://coveralls.io/github/tuftjs/view-responder)
[![Known Vulnerabilities](https://snyk.io/test/github/tuftjs/view-responder/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tuftjs/view-responder?targetFile=package.json)
![npm](https://img.shields.io/npm/v/@tuft/view-responder)

View Responder is a first-party extension for Tuft that allows the use of template engines for rendering views. At present, the following template engines are supported:

* [EJS](https://ejs.co/)
* [Pug](https://pugjs.org)

For detailed information on how Tuft *responders* work, view the [official documentation](https://www.tuft.dev/docs/extensions/#responders).

## Installation
```
  $ npm install @tuft/view-responder
```

Starting from version 2.0.0, the EJS and Pug template engines are listed as peer dependencies and must be manually installed in addition to View Responder.

```
  $ npm install ejs
```

OR

```
  $ npm install pug
```

## Breaking Changes

Prior to version 2.0.0, View Responder exported a single named function called `createViewResponder()` which was passed the name of the desired view engine to use, and both EJS and Pug were listed as package dependencies.

From version 2.0.0 onwards, separate `createEjsResponder()` and `createPugResponder()` functions are exported instead, and the desired view engine must be installed manually. Unlike `createViewResponder()`, both of these functions are async functions and must be called with the `await` keyword.

## Usage

Import either the named `createEjsResponder` function or the `createPugResponder` function, and then invoke it to create a Tuft *responder* that can be inserted into any Tuft application. The *responder* will be triggered by any Tuft response object that contains a `render` property.

For example, to enable the EJS template engine, call the `createEjsResponder` function.

> Note: `createEjsResponder()` and `createPugResponder()` are async functions and require the `await` keyword.

```js
  // index.js

  const { tuft } = require('tuft')
  const { createViewResponder } = require('@tuft/view-responder')

  const app = tuft({
    responders: [await createEjsResponder()]
  })
```

Create an EJS template file like the one below.

```html
<!-- views/index.ejs -->

<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
  <head>
  <body>
    <p>Welcome to <%= title %></p>
  </body>
</html>
```

To render this view, provide a Tuft response object with a `render` property, passing the name of the `'*.ejs'` file. If the template requires interpolated data, like in this example, make sure you include it via the `data` property.

```js
  // index.js

  app.set('GET /', () => {
    return {
      render: 'views/index', // File extension is not required
      data: { title: 'Tuft' }
    }
  })
```
The example above will respond with the following HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Tuft</title>
  <head>
  <body>
    <p>Welcome to Tuft</p>
  </body>
</html>
```

## API

### createEjsResponder([baseDir])

You can pass a base directory for your view files as an optional first argument. For example, if your index view is located at `'views/index.ejs'`, you can pass `'views'` as the second argument. You then only have to refer to the `'index.ejs'` file in your Tuft response.

```js
  const app = tuft({
    responders: [await createEjsResponder('views')] // Include base directory 'views'
  })

  app.set('GET /', () => {
    return {
      render: 'index', // Render 'views/index.ejs'
      data: { title: 'Tuft' }
    }
  })
```

### createPugResponder([baseDir])

You can pass a base directory for your view files as an optional first argument. For example, if your index view is located at `'views/index.pug'`, you can pass `'views'` as the second argument. You then only have to refer to the `'index.pug'` file in your Tuft response.

```js
  const app = tuft({
    responders: [await createPugResponder('views')] // Include base directory 'views'
  })

  app.set('GET /', () => {
    return {
      render: 'index', // Render 'views/index.pug'
      data: { title: 'Tuft' }
    }
  })
```

View Responders recognize the following two properties in a response object:

* `render` - Path to a template file.
* `data` - An object containing the data to be inserted into the rendered HTML.

View Responders are only triggered by the presence of the `render` property. If absent, control of the response will be handed back to the Tuft application.

The `data` property is required only if the template requires interpolated data.

## People
The creator and maintainer of View Responder is [Stuart Kennedy](https://github.com/rav2040).

## License
[MIT](https://github.com/tuftjs/ejs-responder/blob/master/LICENSE)
