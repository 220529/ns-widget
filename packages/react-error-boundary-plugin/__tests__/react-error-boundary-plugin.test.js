'use strict';

const reactErrorBoundaryPlugin = require('..');
const assert = require('assert').strict;

assert.strictEqual(reactErrorBoundaryPlugin(), 'Hello from reactErrorBoundaryPlugin');
console.info('reactErrorBoundaryPlugin tests passed');
