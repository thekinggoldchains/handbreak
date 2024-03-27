const express = require('express')
const router = express.Router()
const mongooseCrudify = require('@voluntarily/mongoose-crudify')

const Widget = require('../models/Widget')
const CommonHelper = require('../helpers/common_helper')
const WidgetHelper = require('../helpers/widget_helper')

/**
 *  list    - GET /widgets/
 *  create  - POST /widgets/
 *  read    - GET /widgets/{id}/
 *  update  - PUT /widgets/{id}/
 *  delete  - DELETE /widgets/{id}/
 */
router.use(
  '/',
  mongooseCrudify({
    Model: Widget,
    beforeActions: [
      {
        middlewares: [WidgetHelper.validateCreateParams],
        only: ['create']
      },
      {
        middlewares: [WidgetHelper.validateWidget],
        only: ['delete']
      }
    ],
    afterActions: [
      {
        middlewares: [CommonHelper.broadcastUpdateMiddleware],
        only: ['update']
      },
      {
        middlewares: [WidgetHelper.addWidget, CommonHelper.broadcastUpdateMiddleware],
        only: ['create']
      },
      {
        // Da uma olhada depois, pq acho que o broadcast está sendo chamado 2x
        // uma dentro do deleteWidget e outra nessa linha de baixo
        middlewares: [WidgetHelper.deleteWidget, CommonHelper.broadcastUpdateMiddleware],
        only: ['delete']
      }
    ]
  })
)

module.exports = router
