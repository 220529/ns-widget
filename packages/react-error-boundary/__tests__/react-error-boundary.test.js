'use strict';

const reactErrorBoundary = require('..');
const assert = require('assert').strict;

assert.strictEqual(reactErrorBoundary(), 'Hello from reactErrorBoundary');
console.info('reactErrorBoundary tests passed');
