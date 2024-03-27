const Widget = require('../models/Widget')
const Display = require('../models/Display')
const CommonHelper = require('./common_helper')
const { parseCookies } = require('nookies')
const { ObjectID } = require('mongodb');

function deleteWidgets(widgets, res) {
  return Promise.all(
    widgets.map(widget => {
      return Widget.findByIdAndRemove(widget)
    })
  ).then(() => CommonHelper.broadcastUpdate(res.io, '', res))
}

async function newDisplay(req, res) {
  const count = await Display.estimatedDocumentCount()
  const newDisplay = new Display({
    name: req.body.name || 'Display #1',
    userId: await ObjectID(parseCookies(res).loggedUserId )
  })
  return newDisplay.save()
}

module.exports = {
  deleteWidgets,
  newDisplay
}
