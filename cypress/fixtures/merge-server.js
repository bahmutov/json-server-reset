const jsonServer = require('json-server')
const reset = require('../../src')
const merge = require('../../src/merge')
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
server.use(merge)
server.db = router.db
server.use(router)

server.listen(4000, () => {
  console.log('JSON Server is running on port 4000')
})
