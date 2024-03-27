const express = require('express')
const router = express.Router()
const parser = require('iptv-playlist-parser')
const https = require('https')
const Device = require('../models/Device')
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
const { parseCookies, setCookie } = require('nookies')
const User = require('../models/User')
const UserFranqueado = require('../models/UserFranqueado')
const Widget = require('../models/Widget')
const CommonHelper = require('../helpers/common_helper')
const crypto = require('crypto');




// Route: /api/v1/device
router
  .get('/', async (req, res, next) => {
    let id = ''
    try {
      id = await parseCookies(res).loggedUserId
    } catch (error) {
      next();
    }

    return Device.find({ userId: id })
      .populate('display')
      .then(devices => {
        return res.json(devices)
      })
      .catch(err => next(err))
  })

  .post('/', async (req, res, next) => {
    const id = await parseCookies(res).loggedUserId

    const licencasTotais = await UserFranqueado.find({ userFranqueadoId: id }, { licencas: 1, _id: 0 })
    const licencasUtilizadas = await Device.countDocuments({ userId: id })
    const role = await User.findById(id, { role: 1 })

    // console.log(role)

    if ((licencasTotais && licencasTotais.length == 0 || licencasTotais[0].licencas <= licencasUtilizadas) && role.role != 'admin') {
      return next(new Error("Limite de licenças disponiveis atingida. Contate o admnistrador para obter mais licenças!"));
    }

    const codigoMatriz = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = crypto.randomInt(0, codigoMatriz.length);
      token += codigoMatriz[randomIndex];
    }
    const newDevice = new Device({
      nome: req.body.nome,
      display: req.body.display,
      userId: id,
      codigo: token,
      status: 'Inativo'
    })
    return newDevice.save()
      .then(savedUser => {
        return res.json(savedUser)
      })
      .catch(err => next(err))
  })
  .patch('/', async (req, res, next) => {
    console.log(req.body)
    try {
      const promises = req.body.devices.map(async (element) => {
        const deviceId = mongoose.Types.ObjectId(element._id);
        const device = await Device.findById(deviceId);

        if ('display' in element) device.display = element.display;
  
        await device.save();
        await CommonHelper.broadcastDeviceUpdate(res.io, element._id);
      });
  
      await Promise.all(promises);
  
      return res.json({ success: true });
    } catch (error) {
      return next(error);
    }
  })

// device/:id
router
  .get('/:id', async (req, res, next) => {
    const { id } = req.params;

    return Device.findById(id).then(device => {
      res.json(device);
    }).catch(err => {
      next(err)
    })
  })
  .delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    return Device.findByIdAndDelete(id)
      .then(deletedDoc => {
        if (deletedDoc) {
          res.json('Documento deletado!');
          // Aqui você pode fazer algo após a exclusão do documento, se necessário
        }
      })
      .then(() => CommonHelper.broadcastDeviceUpdate(res.io, id))
      .catch(error => {
        next(error)
      });
  })
  .patch('/:id', async (req, res, next) => {
    const { id } = req.params;
    return Device.findById(id).then(device => {
      if ('nome' in req.body) device.nome = req.body.nome
      if ('display' in req.body) device.display = req.body.display

      return device
        .save()
        .then(() => CommonHelper.broadcastDeviceUpdate(res.io, id))
        .then(() => {
          return res.json({ success: true })
        })
    })
  });

router
  .post('/codigo', async (req, res, next) => {
    try {

      const userAgent = req.headers['user-agent'];
      const device = await Device.findOne({ codigo: req.body.codigo });
      console.log("Aqui => ", device)
      if (device) {
        device.status = "Online";
        if (userAgent) {
          device.identificador = userAgent;
        }
        return device
        .save()
        .then(() => CommonHelper.broadcastDeviceUpdate(res.io, device._id))
        .then(() => res.json(device))
      }
      else {
        res.status(500).json({ error: "Código incorreto, ou dispositivo não encontrado." });
      }
    }
    catch(err) {
      return next(err);
    }
  })
  .get('/codigo/:codigo', async (req, res, next) => {
    const { codigo } = req.params;
    console.log("bate aqui => ",codigo);
    const device = await Device.findOne({ codigo: codigo })
    if (device) {
      return res.json(device)
    }
    else {
      return res.status(500).json({ error: "Dispositivo não encontrado." });
    }
    })


module.exports = router
