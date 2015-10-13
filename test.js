import fs from 'fs';
import test from 'ava';
import Promise from 'pinkie-promise';
import fn from './';

function fixture(cb) {
	setImmediate(() => cb('unicorn'));
}

function fixture2(x, cb) {
	setImmediate(() => cb(x));
}

function fixture3(cb) {
	setImmediate(() => cb('unicorn', 'rainbow'));
}

function fixture4() {
	return 'unicorn';
}

function fixture5(cb) {
	setImmediate(() => cb('unicorn'));
	return true;
}

fixture5.meow = cb => {
	setImmediate(() => cb('unicorn'));
};

test('main', async t => {
	t.is(typeof fn(fixture)().then, 'function');

	t.is(await fn(fixture)(), 'unicorn');
});

test('pass argument', async t => {
	t.is(await fn(fixture2)('rainbow'), 'rainbow');
});

test('custom Promise module', async t => {
	t.is(await fn(fixture, Promise)(), 'unicorn');
});

test('multiArgs option', async t => {
	t.same(await fn(fixture3, {multiArgs: true})(), ['unicorn', 'rainbow']);
});

test('wrap core method', async t => {
	const result = await fn(fs.readFile, {multiArgs: true})('package.json');

	t.is(result[0], null);
	t.is(JSON.parse(result[1]).name, 'rfpify');
});

test('module support', async t => {
	const result = await fn.all(fs, { multiArgs: true }).readFile('package.json');

	t.is(result[0], null);
	t.is(JSON.parse(result[1]).name, 'rfpify');
});

test('module support - preserves non-function members', t => {
	const module = {
		method: function () {},
		nonMethod: 3
	};

	t.same(Object.keys(module), Object.keys(fn.all(module)));
	t.end();
});

test('module support - transforms only members in opions.include', t => {
	const module = {
		method1: fixture,
		method2: fixture2,
		method3: fixture4
	};

	const pModule = fn.all(module, {
		include: ['method1', 'method2']
	});

	t.is(typeof pModule.method1().then, 'function');
	t.is(typeof pModule.method2('fainbow').then, 'function');
	t.not(typeof pModule.method3().then, 'function');
	t.end();
});

test('module support - doesn\'t transform members in opions.exclude', t => {
	const module = {
		method1: fixture4,
		method2: fixture4,
		method3: fixture
	};

	const pModule = fn.all(module, {
		exclude: ['method1', 'method2']
	});

	t.not(typeof pModule.method1().then, 'function');
	t.not(typeof pModule.method2().then, 'function');
	t.is(typeof pModule.method3().then, 'function');
	t.end();
});

test('module support - options.include over opions.exclude', t => {
	const module = {
		method1: fixture,
		method2: fixture2,
		method3: fixture4
	};

	const pModule = fn.all(module, {
		include: ['method1', 'method2'],
		exclude: ['method2', 'method3']
	});

	t.is(typeof pModule.method1().then, 'function');
	t.is(typeof pModule.method2('rainbow').then, 'function');
	t.not(typeof pModule.method3().then, 'function');
	t.end();
});

test('module support — function modules', t => {
	const pModule = fn.all(fixture5);

	t.is(typeof pModule().then, 'function');
	t.is(typeof pModule.meow().then, 'function');
	t.end();
});

test('module support — function modules exclusion', t => {
	const pModule = fn.all(fixture5, {
		excludeMain: true
	});

	t.is(typeof pModule.meow().then, 'function');
	t.not(typeof pModule(function () {}).then, 'function');
	t.end();
});
