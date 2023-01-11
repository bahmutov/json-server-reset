const debug = require('debug')('json-server-reset')
const { isEmptyObject, arraysAreDifferent } = require('./utils')

/**
 * adds the `/reset` route to your json-server
 * @example http localhost:3000/reset todos=[]
 * @see https://github.com/bahmutov/json-server-reset
 */
function jsonServerReset(req, res, next) {
  if (req.method === 'POST' && req.path === '/reset') {
    console.log('resetting database')
    // TODO it would be nice to restore not with an empty object
    // but with the initial database
    const data = req.body || {}
    if (isEmptyObject(data)) {
      console.error('Resetting with an empty object not allowed')
      return res.sendStatus(400)
    }
    if (Array.isArray(data)) {
      console.error('Resetting with an array not allowed')
      return res.sendStatus(400)
    }

    debug('new data %o', data)

    const currentKeys = Object.keys(req.app.db.getState()).sort()
    const newKeys = Object.keys(data).sort()
    debug('existing REST keys %o', currentKeys)
    debug('new REST keys %o', newKeys)
    if (arraysAreDifferent(currentKeys, newKeys)) {
      console.warn(
        '⚠️ Resetting REST endpoints %s with %s',
        JSON.stringify(currentKeys),
        JSON.stringify(newKeys),
      )
    }

    req.app.db.setState(data)
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

module.exports = jsonServerReset
