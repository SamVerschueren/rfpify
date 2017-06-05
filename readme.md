# rfpify

> Promisify a result-first callback-style function.

---

<p align="center"><b>Deprecated</b> in favour of <a href="https://github.com/sindresorhus/pify">pify</a> with the <a href="https://github.com/sindresorhus/pify#errorfirst">errorFirst</a> option.</p>

---


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

### rfpify(input, [promiseModule], [options])

Returns a promise wrapped version of the supplied function or module.

#### input

Type: `function`, `object`

Result-first callback-style function.

#### promiseModule

Type: `function`

Custom promise module to use instead of the native one.

Check out [`pinkie-promise`](https://github.com/floatdrop/pinkie-promise) if you need a tiny promise polyfill.

#### options

##### multiArgs

Type: `boolean`
Default: `false`

By default, the promisified function will only return the first argument from the callback, which works fine for most APIs. Turning this on will make it return an array of
all arguments from the callback, instead of just the first argument.

##### include

Type: `array` of (`string`|`regex`)

Methods in a module to promisify. Remaining methods will be left untouched.

##### exclude

Type: `array`
Default: `[/.+Sync$/]`

Methods in a module **not** to promisify. Methods with names ending with 'Sync' are excluded by default.

##### excludeMain

Type: `boolean`
Default: `false`

By default, if given module is a function itself, this function will be promisified. Turn this option on if you want to promisify only methods of the module.

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
