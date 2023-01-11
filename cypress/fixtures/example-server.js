const jsonServer = require('json-server')
const initJsonServerReset = require('../../src/init-reset')
const merge = require('../../src/merge')
const path = require('path')
const dataFilename = path.join(__dirname, 'data.json')

// create json server and its router first
const server = jsonServer.create()
const router = jsonServer.router(dataFilename)

console.log('db', router.db.getState())

server.use(
  jsonServer.defaults({
    bodyParser: true,
    readOnly: false,
  }),
)

// list of REST resources to clear on startup
const clear = ['todos', 'people']
server.use(initJsonServerReset({ db: router.db, clear }))
server.use(merge)
server.db = router.db
server.use(router)

server.listen(4000, () => {
  console.log('JSON Server is running on port 4000')
})
