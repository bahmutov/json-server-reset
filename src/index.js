const debug = require('debug')('json-server-reset')

function isEmptyObject (x) {
  return typeof x === 'object' && Object.getOwnPropertyNames(x).length === 0
}

// adds /reset route to your json-server
// to use execute POST /reset <JSON state>
// for example using httpie
//   http localhost:3000/reset todos=[]
function jsonServerReset (req, res, next) {
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

    req.app.db.setState(data)
    // and immediately write the database file
    req.app.db.write()
    debug('have written updated data to disk')

    return res.sendStatus(200)
  }
  // not a POST /reset
  next()
}

module.exports = jsonServerReset
