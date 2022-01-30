
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./my-clarigen-project.cjs.production.min.js')
} else {
  module.exports = require('./my-clarigen-project.cjs.development.js')
}
