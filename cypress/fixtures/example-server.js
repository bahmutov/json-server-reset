const jsonServer = require('json-server')
const reset = require('../..')
const setApp = require('../../src/set-app')
const path = require('path')
const dataFilename = path.join(__dirname, 'data.json')

// create json server and its router first
const server = jsonServer.create()
const router = jsonServer.router(dataFilename)
server.use(jsonServer.defaults({
  bodyParser: true,
  readOnly: false
}))
server.use(reset)
// then pass it to json-server-reset
server.use(setApp(server, router.db))
server.use(router)

server.listen(4000, () => {
  console.log('JSON Server is running on port 4000')
})
