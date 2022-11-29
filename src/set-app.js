// deprecated
function init (app, db) {
  return function setApp (req, res, next) {
    if (!req.app) {
      req.app = app
    }
    if (!app.db) {
      app.db = db
    }
    next()
  }
}

module.exports = init
