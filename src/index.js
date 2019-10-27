const debug = require('debug')('json-server-reset')

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
