const routes = require('next-routes')

module.exports = routes()
  .add('/slideshow/:id', 'slideshow')
  .add('/multidisplayslide/:id', 'multidisplayslide')
  .add('/display/:display', 'display')
