// TODO grab filenames from CLI arguments
const path = require('path')
const application = path.join(__dirname, '..', 'app', 'index.html')
const db = path.join(__dirname, '..', 'cypress', 'fixtures', 'data.json')

const Bundler = require('parcel-bundler')
const options = {}
const bundler = new Bundler(application, options)

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(db)
const middlewares = jsonServer.defaults()

const bundlerMiddleware = bundler.middleware()

server.use((req, res, next) => {
  if (req.path === '/todos') {
    // data request, continue to JSON server
    return next()
  }

  console.log('request for parcel %s %s', req.method, req.path)
  return bundlerMiddleware(req, res, next)
})

server.use(middlewares)
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running at port 3000')
})
