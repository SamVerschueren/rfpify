# rfpify [![Build Status](https://travis-ci.org/SamVerschueren/rfpify.svg?branch=master)](https://travis-ci.org/SamVerschueren/rfpify)

> Promisify a result-first callback-style function.

*Some APIs do not use an error-first callback approach. This promisify library promisifies those callbacks. If you are looking for a library that promisifies
normal error-first callback functions, take a look at [pify](https://github.com/sindresorhus/pify)*

## Install

```
$ npm install --save rfpify
```


## Usage

```js
const rfpify = require('rfpify');

rfpify(stream.once.bind(stream))('data').then(data => {
	// handle data
});
```


## API

### rfpify(input, [promiseModules], [options])

Returns a promise wrapped version of the supplied function.

#### input

Type: `function`

Result-first callback-style function.

### rfpify.all(module, [promiseModule], [options])

Returns a version of the module with all its methods promisified.

#### module

Type: `object`

Module whose methods you want to promisify.

#### promiseModule

Type: `function`

Custom promise module to use instead of the native one.

Check out [`pinkie-promise`](https://github.com/floatdrop/pinkie-promise) if you need a tiny promise polyfill.

##### multiArgs

Type: `boolean`
Default: `false`

By default, the promisified function will only return the first argument from the callback, which works fine for most APIs. Turning this on will make it return an array of
all arguments from the callback, instead of just the first argument.

##### include

Type: `array`

*Works for `rfpify.all()` only.*

Pick which methods in a module to promisify. Remaining methods will be left untouched.

##### exclude

Type: `array`

*Works for `rfpify.all()` only.*

Pick which methods in a module **not** to promisify.

##### excludeMain

Type: `boolean`
Default: `false`

*Works for `rfpify.all()` only.*

By default, if given `module` is a function itself, this function will be promisified. Turn this option on if you want to promisify only methods of the module.

```js
const rfpify = require('rfpify');

function fn() {
	return true;
}

fn.method = (data, callback) => {
	setImmediate(() => {
		callback(data);
	});
};

// promisify methods but not fn()
const promiseFn = rfpify.all(fn, {excludeMain: true});

if (promiseFn()) {
	promiseFn.method('hi').then(data => {
		console.log(data);
	});
}
```

## Related

- [pify](https://github.com/sindresorhus/pify) - Promisify a callback-style function

## License

MIT © [Sam Verschueren](http://github.com/SamVerschueren)
