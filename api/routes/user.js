const express = require('express')
const router = express.Router()
const passport = require('passport')
const { createUser } = require('../controllers/user')
const { criaNovoBucket, deletaBucket } = require('../services/firebase')
const { parseCookies } = require('nookies') 
const mongoose = require('mongoose');

const User = require('../models/User')
const Display = require('../models/Display')
const UserFranqueado = require('../models/UserFranqueado')
const Slideshow = require('../models/Slideshow')
const Slide = require('../models/Slide')

router.get('/', async function (req, res, next) {
  try {
    let userIDs;
    const users = await User.find({})

    userIDs = users.map(function (user) { return user._id; });

    const displays = await Display.find({ userId: { $in: userIDs } })

    return res.json({ usuarios: users, telas: displays })
  } catch (err) {
    return console.log(err)

  }
})

router.get('/info/:id', async function (req, res, next) {
  try {
    const {id} = req.params;
    const users = await User.findOne({_id: id})
    const displays = await Display.find({ userId: id })
    const licencas = await UserFranqueado.find({ userFranqueadoId: id }, { licencas: 1, _id: 0 })

    return res.json({ usuarios: users, telas: displays, licencas: licencas[0] })
  } catch (err) {
    return res.json({error: err.message})

  }
})

router.post('/login', passport.authenticate('local'), function (req, res) {
  res.json({ success: true, user: req.user })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

// Route /api/user/franqueados
router.get('/franqueados', async function (req, res, next) {
  try {
    const userId = await req.user? await req.user._id : parseCookies(res).loggedUserId;
    const usersFranqueados = await UserFranqueado.find({ userFranqueadorId: userId })
    const userIDs = usersFranqueados.map(function (user) { return user.userFranqueadoId; });

    const users = await User.find({ _id: { $in: userIDs } })
    const displays = await Display.find({ userId: { $in: userIDs } })

    //transforma o tamanho em MB
    users.forEach(e => {
      e.espaco = e.espaco / Math.pow(1024, 2)
    });

    return res.json({ usuarios: users, telas: displays, franqueadoDetalhes: usersFranqueados })
  } catch (err) {
    return console.log(err)

  }
})

router.post('/franqueados', function (req, res) {
  if (req.body.email == '' || req.body.name == '') {
    return res.json({ success: false, msg: "Nome e e-mail são obrigatórios" })
  }
  if (req.body.repeatSenha != req.body.password) {
    return res.json({ success: false, msg: "As senhas digitadas não conferem" })
  }
  if (req.body.password.length < 6) {
    return res.json({ success: false, msg: "Minimo de 6 digitos de senha exigido" })
  }
  let tamanho = null;
  if (req.body.espaco)
    tamanho = req.body.espaco * Math.pow(1024, 2)

  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    role: req.body.role,
    espaco: tamanho
  })
  User.register(newUser, req.body.password, function (err, data) {
    if (err) {
      return res.json({ success: false, msg: err.message })

    } else {
      // criaNovoBucket()
      const newFranqueado = new UserFranqueado({
        userFranqueadoId: data._id,
        userFranqueadorId: req.user ? req.user._id : parseCookies(res).loggedUserId,
        licencas: req.body.licencas
      }).save();
      criaNovoBucket(data._id)
      return res.json({ success: true, msg: 'Usuário Cadastrado com Sucesso!' })
    }
  })

})

router.patch('/franqueados/:id', async function (req, res, next) {
  const { id } = req.params
  try {
    const franqueado = await UserFranqueado.findOne({ userFranqueadoId: id })
    const user = await User.findById(id)
    if (!franqueado)
      return res.json({ success: false, msg: "Franqueado não Encontrado!" })
    if (!user)
      return res.json({ success: false, msg: "Usuario não Encontrado!" })

    if ('licencas' in req.body) franqueado.licencas = req.body.licencas
    if (req.body.password != '') {
      if (req.body.password.length < 6) return res.json({ success: false, msg: "Minimo de 6 digitos de senha exigido" })
      if (req.body.repeatSenha != req.body.password) return res.json({ success: false, msg: "As senhas digitadas não conferem" })
      await user.setPassword(req.body.password)
    }
    if ('espaco' in req.body) user.espaco = req.body.espaco * Math.pow(1024, 2)
    if ('name' in req.body) user.name = req.body.name
    if ('email' in req.body) user.email = req.body.email
    if ('username' in req.body) user.username = req.body.username
    if ('ativo' in req.body) user.ativo = req.body.ativo
    
    await franqueado.save()
    await user.save()

    return res.json({ success: true, msg: "Dados atualizados com sucesso!" })

  }
  catch (err) {
    return res.json({ success: false, msg: `${err}` })
  }

})

router.delete('/franqueados/:id', async function (req, res, next) {
  const { id } = req.params

  try {
    const user = await User.findByIdAndDelete(id)
    const franqueado = await UserFranqueado.findOneAndDelete({ userFranqueadoId: id })
    const display = await Display.deleteMany({userId: id})
    const slideshow = await Slideshow.find({ userId: id })
    let slides = null;
    if (slideshow) {
      slides = await Slide.deleteMany({ slideshow: { $in: slideshow } })
      await Slideshow.deleteMany({ userId: id })
    }

    deletaBucket(id)
    return res.json({ success: true, msg: "Dados removidos com sucesso!" })


  } catch (err) {
    return res.json({ success: false, msg: `${err}` })

  }
})


router.get('/espaco', async function (req, res, next) {
  const user = await req.user ? await req.user._id : parseCookies(res).loggedUserId;
  return res.json({ espaco: user ? user.espaco : 314572800 })
})


module.exports = router
