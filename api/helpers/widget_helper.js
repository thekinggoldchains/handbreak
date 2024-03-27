const Display = require('../models/Display')
const Widget = require('../models/Widget')
const CommonHelper = require('./common_helper')
const WidgetList = require('../../widgets/widget_list')
// eslint-disable-next-line no-unused-vars
const Express = require('express')

/**
 * @param {Express.Request} req
 * @param {string} req.body.type
 * @param {String} req.body.display
 * @param {any} req.body.data
 * @param {Number} req.body.x
 * @param {Number} req.body.y
 * @param {Number} req.body.w
 * @param {Number} req.body.h
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 * @returns {Promise<void>}
 */
async function validateCreateParams(req, res, next) {
  if (!req.body.type) {
    return res.status(400).json({error: 'Type is required'})
  }
  if (!req.body.display) {
    return res.status(400).json({error: 'Display is required'})
  }
  if (!WidgetList.includes(req.body.type)) {
    return res.status(400).json({error: 'Incorrect Type'})
  }
  try {
    const display = await Display.findById(req.body.display)
    if (!display) {
      return res.status(400).json({error: 'Display not found'})
    }
  } catch (e) {
    return res.status(500).json({error: 'Internal server error'})
  }
  next()
}

/**
 * @param {Express.Request} req
 * @param {string} req.params._id
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 * @returns {Promise<void>}
 */
async function validateWidget(req, res, next) {
  try {
    const widget = await Widget.findById(req.params._id)
    if (!widget) {
      return res.status(400).json({error: 'Widget not found'})
    }
    req.widget = widget
  } catch (e) {
    return res.status(500).json({error: 'Internal server error'})
  }
  next()
}

async function addWidget(req) {
  try {
    let widget = req.crudify.result
    const display = await Display.findById(widget.display)
    display.widgets.push(widget._id)
    await display.save()
  } catch (e) {
    throw e
  }
}

async function deleteWidget(req, res) {
  try {
    const display = await Display.findById(req.widget.display)
    if (display) {
      display.widgets = display.widgets.filter(function (value) {
        return !req.widget._id.equals(value)
      })
      await display.save()
    }
  } catch (e) {
    throw e
  }
}

module.exports = {
  deleteWidget,
  addWidget,
  validateCreateParams,
  validateWidget
}
