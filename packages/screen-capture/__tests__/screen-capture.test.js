'use strict';

const screenCapture = require('..');
const assert = require('assert').strict;

assert.strictEqual(screenCapture(), 'Hello from screenCapture');
console.info('screenCapture tests passed');
