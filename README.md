# View Responder

![Node.js CI](https://github.com/tuftjs/view-responder/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/tuftjs/view-responder/badge.svg)](https://coveralls.io/github/tuftjs/view-responder)
[![Known Vulnerabilities](https://snyk.io/test/github/tuftjs/view-responder/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tuftjs/view-responder?targetFile=package.json)

View Responder is a first-party extension for Tuft that allows the use of template engines for rendering views. At present, the following template engines are supported:

* [EJS](https://ejs.co/)
* [Pug](https://pugjs.org)

For detailed information on how Tuft *responders* work, view the [official documentation](https://www.tuft.dev/docs/extensions/#responders).

## Installation
```
  $ npm install @tuft/view-responder
```

## Usage

Import the named `createViewResponder` function, and then invoke it to create a Tuft *responder* that can be inserted into any Tuft application. The *responder* will be triggered by any Tuft response object that contains a `render` property.

For example, to enable the EJS template engine, call the `createViewResponder` function, passing `'ejs'` as the first argument.

```js
  // index.js

  const { tuft } = require('tuft')
  const { createViewResponder } = require('@tuft/view-responder')

  const app = tuft({
    responders: [createViewResponder('ejs')]
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
      render: 'views/index.ejs',
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

### createViewResponder(engine[, baseDir])

Pass the name of the template engine you want to utilize as the first argument. There are currently only two engines supported: `'ejs'` and `'pug'`.

You can pass a base directory for your view files as an optional second argument. For example, if your index view is located at `'views/index.ejs'`, you can pass `'views'` as the second argument. You then only have to refer to `'index.ejs'` in your Tuft response.

View Responder recognizes the following two properties in a response object:

* `render` - Path to a template file.
* `data` - An object containing the data to be inserted into the rendered HTML.

View Responder is only triggered by the presence of the `render` property. If absent, control of the response will be handed back to the Tuft application.

The `data` property is required only if the template requires interpolated data.

## People
The creator and maintainer of View Responder is [Stuart Kennedy](https://github.com/rav2040).

## License
[MIT](https://github.com/tuftjs/ejs-responder/blob/master/LICENSE)
