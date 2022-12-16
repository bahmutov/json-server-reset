const debug = require('debug')('json-server-reset')
const { isEmptyObject } = require('./utils')

/**
 * Merges the current list of top level resources
 * with the given one in the request body.
 */
function jsonServerMerge(req, res, next) {
  if (req.method === 'POST' && req.path === '/merge') {
    console.log('merging database')
    // TODO it would be nice to restore not with an empty object
    // but with the initial database
    const data = req.body || {}
    if (isEmptyObject(data)) {
      console.error('Merging with an empty object not allowed')
      return res.sendStatus(400)
    }
    if (Array.isArray(data)) {
      console.error('Merging with an array not allowed')
      return res.sendStatus(400)
    }

    debug('new data to merge %o', data)

    const currentData = req.app.db.getState()
    const currentKeys = Object.keys(currentData).sort()
    const newKeys = Object.keys(data).sort()
    debug('existing REST keys %o', currentKeys)
    debug('merging REST keys %o', newKeys)
    const newDatabase = { ...currentData, ...data }
    req.app.db.setState(newDatabase)

    // and immediately write the database file
    const p = req.app.db.write()
    if (p && p.then) {
      return p.then(() => {
        debug('have async written updated data to disk')
        return res.sendStatus(200)
      })
    } else {
      debug('have sync written updated data to disk')
      return res.sendStatus(200)
    }
  }
  // not a POST /reset
  next()
}

module.exports = jsonServerMerge
