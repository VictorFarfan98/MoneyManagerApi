const createError = require('http-errors')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./src/router/routes')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use('/api', routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({ message: res.locals.message })
})

let PORT

if (process.env.NODE_ENV && (process.env.NODE_ENV === 'qa' || process.env.NODE_ENV === 'production' )) {
  PORT = 80
  app.listen(PORT, () => console.info('Project listening on port 80'))
} else {
  PORT = 3003
  app.listen(PORT, () => console.info('Project listening on port 3003'))
}
