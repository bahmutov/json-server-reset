'use strict'

/* eslint-env mocha */
const { lazyAss: la } = require('lazy-ass')
const is = require('check-more-types')
const jsonServerReset = require('.')

describe('json-server-reset', () => {
  it('is a middleware function', () => {
    la(is.fn(jsonServerReset))
  })
})
