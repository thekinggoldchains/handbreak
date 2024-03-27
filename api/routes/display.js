const express = require('express')
const router = express.Router()
const parser = require('iptv-playlist-parser')
const https = require('https')
const Display = require('../models/Display')
const DisplayHelper = require('../helpers/display_helper')
const CommonHelper = require('../helpers/common_helper')
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
const { parseCookies } = require('nookies')
const User = require('../models/User')
const UserFranqueado = require('../models/UserFranqueado')
const Widget = require('../models/Widget')


// Route: /api/v1/display
router
  .get('/', async (req, res, next) => {
    let id = ''
    try {
      id = await parseCookies(res).loggedUserId
    } catch (error) {
      next();
    }

    return Display.find({ userId: id })
      .populate('widgets')
      .sort({ _id: -1})
      .then(displays =>
        displays && displays.length > 0
          ? displays
          : id == undefined ? next() : DisplayHelper.newDisplay(req, res).then(() => Display.find({ userId: id }).populate('widgets'))
      )
      .then(displays => {
        return res.json(displays)
      })
      .catch(err => next(err))
  })

  .post('/', async (req, res, next) => {
    const id = await parseCookies(res).loggedUserId

    const licencasTotais = await UserFranqueado.find({ userFranqueadoId: id }, { licencas: 1, _id: 0 })
    const licencasUtilizadas = await Display.countDocuments({ userId: id })
    const role = await User.findById(id, {role: 1})

    console.log(role)

    if ((licencasTotais.length == 0 || licencasTotais[0].licencas <= licencasUtilizadas) && role.role != 'admin') {
      return res.status(403).json({ error: "Limite de licenças disponíveis atingido. Contate o administrador para obter mais licenças!" });
    }

    return DisplayHelper.newDisplay(req, res, next)
      .then(display => {
        if (!display) {
          throw new Error('Display not created')
        }
        return CommonHelper.broadcastUpdate(res.io, '', res).then(() => res.json(display))
      })
      .catch(err => next(err))
  })
// Route: /api/v1/display/user/:id //para tvs
router
  .get('/user/:id', async (req, res, next) => {
    const { id } = req.params
    mongoose.Types.ObjectId.isValid(id)
    return Display.find({ userId: id })
      .populate('widgets')
      .then(displays =>
        displays && displays.length > 0
          ? displays
          : id == undefined ? next() : DisplayHelper.newDisplay(req, res).then(() => Display.find({ userId: id }).populate('widgets'))
      )
      .then(displays => {
        return res.json(displays)
      })
      .catch(err => next(err))
  })


// Route: /api/v1/display/:id
router
  .get('/:id', (req, res, next) => {
    const { id } = req.params
    mongoose.Types.ObjectId.isValid(id)
    return Display.findById(id)
      .populate('widgets')
      .then(display => {
        return res.json(display)
      })
      .catch(err => next(err))
  })
  .get('/:id/widgets', (req, res, next) => {
    const { id } = req.params
    return Display.findById(id)
      .populate('widgets')
      .then(display => {
        return res.json(display.widgets)
      })
      .catch(err => next(err))
  })
  .delete('/:id', (req, res, next) => {
    const { id } = req.params
    return Display.findByIdAndDelete(id)
      .then(display => {
        if (!display) return next('Display not found')
        return DisplayHelper.deleteWidgets(display.widgets, res).then(() => {
          return res.json({ success: true })
        })
      })
      .catch(err => next(err))
  })
  .patch('/:id', (req, res, next) => {
    const { id } = req.params
    return Display.findById(id)
      .then(display => {
        if (!display) return next(new Error('Display not found'))

        if ('name' in req.body) display.name = req.body.name
        if ('layout' in req.body) display.layout = req.body.layout
        if ('statusBar' in req.body) display.statusBar = req.body.statusBar
        if ('scale' in req.body) display.scale = req.body.scale

        return display
          .save()
          .then(() => CommonHelper.broadcastUpdate(res.io, id))
          .then(() => {
            return res.json({ success: true })
          })
      })
      .catch(err => next(err))
  })

const fetchPlaylist = () => {
  return new Promise((resolve, reject) => {
    https.get('https://raw.githubusercontent.com/LITUATUI/M3UPT/main/M3U/M3UPT.m3u', res => {
      let data = []

      res.on('data', chunk => {
        data.push(chunk)
      })

      res.on('end', () => {
        const playlist = Buffer.concat(data).toString()
        const parsedPlaylist = parser.parse(playlist)
        resolve(parsedPlaylist)
      })
    })
      .on('error', err => {
        reject(err.message)
      })
  })
}

router.get('/iptv/listaTv', async function (req, res, next) {
  try {
    const playlist = await fetchPlaylist()
    res.send(playlist)
  } catch (err) {
    return next(err)
  }
})

router.post('/clone/:id', async function (req, res, next) {
  try {
    const { id } = req.params;
    const displayId = id;

    // Passo 1: Criar o display clone
    const displayOriginal = await Display.findOne({ _id: mongoose.Types.ObjectId(displayId) });
    const novoDisplay = { ...displayOriginal };
    const novoDisplayId = mongoose.Types.ObjectId(); // Gera um novo ID
    novoDisplay._id = novoDisplayId; // Atualiza o ID do display
    novoDisplay.widgets = []; // Zera o array de widgets
    novoDisplay.name = displayOriginal.name + "_Copy";
    novoDisplay.userId = displayOriginal.userId;

    // Passo 2: Clonar os widgets
    const widgetsOriginais = await Widget.find({ display: mongoose.Types.ObjectId(displayId) }).exec();
    const widgetsClonadosIds = [];

    for (const widgetOriginal of widgetsOriginais) {
      const novoWidget = { ...widgetOriginal };
      const novoWidgetId = mongoose.Types.ObjectId(); // Gera um novo ID
      novoWidget._id = novoWidgetId; // Atualiza o ID do widget
      novoWidget.display = novoDisplayId; // Atualiza o ID do display no widget clonado
      novoWidget.type = widgetOriginal.type;
      novoWidget.data = widgetOriginal.data;
      novoWidget.x = widgetOriginal.x;
      novoWidget.y = widgetOriginal.y;
      novoWidget.w = widgetOriginal.w;
      novoWidget.h = widgetOriginal.h;
      await Widget.create(novoWidget); // Insere o widget clonado
      widgetsClonadosIds.push(novoWidgetId); // Reserva o ID do widget clonado
    }

    // Passo 3: Atualizar o display clone com os widgets clonados
    novoDisplay.widgets = widgetsClonadosIds;
    await Display.create(novoDisplay);

    console.log('Clonagem de display concluída com sucesso!');
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao clonar display:', error);
    next(error);
  }
})

module.exports = router
