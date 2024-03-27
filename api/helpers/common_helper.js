const { parseCookies } = require('nookies')

async function getCookie() {
  return parseCookies(null).displayId
}

async function broadcastUpdate(io, displayId = '', res) {
  const displayCookie = await parseCookies(res).display
  let display = displayId ? displayId : displayCookie
  io.emit(`admin:update:${display}`)
  console.log("broadcast update ===> DISPLAY:", displayId ?? displayCookie)
  return Promise.resolve()
}

async function broadcastDeviceUpdate(io, deviceId = '') {
  io.emit(`device:update:${deviceId}`)
  return Promise.resolve()
}

function broadcastUpdateMiddleware(req, res) {
  if (req.crudify.widget.display) {
    return broadcastUpdate(res.io, req.crudify.widget.display)
  }
  return broadcastUpdate(res.io) 
}

module.exports = {
  broadcastUpdate,
  broadcastDeviceUpdate,
  broadcastUpdateMiddleware
}

