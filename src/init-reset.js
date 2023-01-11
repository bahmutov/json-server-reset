const debug = require('debug')('json-server-reset')
const jsonServerReset = require('./reset')

function initJsonServerReset(options = {}) {
  debug('init options keys %o', Object.keys(options))
  if (options.db && options.clear) {
    const db = options.db
    debug('resources to clear', options.clear)
    const state = db.getState()
    let changedState = false
    Object.keys(state).forEach((key) => {
      if (options.clear.includes(key)) {
        debug('clearing %s', key)
        state[key] = []
        changedState = true
      }
    })
    if (changedState) {
      debug('saving updated DB')
      db.setState(state)
      db.write()
    }
  }
  return jsonServerReset
}

module.exports = initJsonServerReset
