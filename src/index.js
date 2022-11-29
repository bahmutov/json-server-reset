const debug = require('debug')('json-server-reset')

function isEmptyObject (x) {
  return typeof x === 'object' && Object.getOwnPropertyNames(x).length === 0
}

function arraysAreDifferent (list1, list2) {
  return JSON.stringify(list1) !== JSON.stringify(list2)
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

    const currentKeys = Object.keys(req.app.db.getState()).sort()
    const newKeys = Object.keys(data).sort()
    debug('existing REST keys %o', currentKeys)
    debug('new REST keys %o', newKeys)
    if (arraysAreDifferent(currentKeys, newKeys)) {
      console.warn('⚠️ Resetting REST endpoints %s with %s',
        JSON.stringify(currentKeys), JSON.stringify(newKeys))
    }

    req.app.db.setState(data)
    // and immediately write the database file
    return req.app.db.write().then(() => {
      debug('have written updated data to disk')
      return res.sendStatus(200)
    })
  }
  // not a POST /reset
  next()
}

module.exports = jsonServerReset
