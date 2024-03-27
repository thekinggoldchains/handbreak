const express = require('express');
const { parseCookies } = require('nookies');
const router = express.Router();
const User = require('../models/User')
const UserFranqueado = require('../models/UserFranqueado')
const Display = require('../models/Display');
const Slideshow = require('../models/Slideshow');
const { criaNovoBucket, deletaBucket } = require('../services/firebase');
const Slide = require('../models/Slide');


router
.get('/', async function (req, res, next) {
  try {
    const userId = await parseCookies(res).loggedUserId
    const user = await User.findById(userId);
    let result = {}

    if (user.role == 'admin') {
      const usersFranquia = await UserFranqueado.find({}); //pego todos franqueados
      const allUsers = await User.find({})
      const allUsersAdmins = allUsers.filter(result => {return result.role === 'admin'})

      const usersFranquiaId = usersFranquia.filter(result => { return result.userFranqueadorId != null });

      const _users = await User.find({ _id: { $nin: usersFranquiaId.map(result => { return result.userFranqueadoId }) }, role: { $not: /^admin.*/ } }) // pego os users não franqueados e nao administradores.
      const _usersAtacado = await User.find({ _id: { $in: usersFranquiaId.map(result => { return result.userFranqueadoId }) }, role: { $not: /^admin.*/ } }) // pego os users franqueados e nao administradores.

      const displaysVarejo = await Display.find({ userId: { $in: _users.map(result => { return result._id }) } }) //contabilizo os displays vendidos por varejo (maior valor)
      const displaysAtacado = await Display.find({ userId: { $in: _usersAtacado.map(result => { return result._id }) } }) //contabilizo os displays vendidos por atacado (franqueados) =>(menor valor)
      const allDisplays = await Display.find({}) //contabilizo os displays vendidos por atacado (franqueados) =>(menor valor)

      const userParaFaturamento = usersFranquia.filter(faturamento => !allUsersAdmins.find(admin => admin._id.toString() === faturamento.userFranqueadoId.toString()))

      let faturamentoTotal = 0
      userParaFaturamento.forEach(e => {
        faturamentoTotal = faturamentoTotal += ((e.licencas * e.valorLicenca) / 100)
      })

      const displaysTotais = allDisplays.length // displays total
      const usersTotais = allUsers.length //total users

      allUsers.forEach(e => {
        e.espaco = e.espaco / Math.pow(1024, 2)
      });

      result = {
        allUsers: allUsers,
        allDisplays: allDisplays,
        displaysAtacado: displaysAtacado,
        displaysVarejo: displaysVarejo,
        totalUsers: usersTotais,
        totalFaturamento: faturamentoTotal,
        totalDisplay: displaysTotais,
        usersFranquia: usersFranquia
      }

    } else if (user.role == 'user') {

      const allDisplays = await Display.find({ userId: user._id })
      const custos = await UserFranqueado.findOne({ userFranqueadoId: user._id })
      const custosTotais = ((custos.licencas * custos.valorLicenca) / 100)

      user.espaco = user.espaco / Math.pow(1024, 2)

      result = {
        allUsers: [user],
        allDisplays: allDisplays,
        displaysAtacado: null,
        displaysVarejo: null,
        totalUsers: 1,
        totalFaturamento: custosTotais,
        totalDisplay: allDisplays.length,
        usersFranquia: [custos]
      }
    } else if (user.role == 'franqueador') {

      const custos = await UserFranqueado.find({ $or: [{ userFranqueadoId: user._id }, { userFranqueadorId: user._id }] })
      const allDisplays = await Display.find({ userId: user._id })
      const usersFranquia = custos.filter(franqueado => { return franqueado.userFranqueadorId })
      const allUsers = await User.find({ $or: [{ _id: user._id }, { _id: { $in: usersFranquia.map(result => { return result.userFranqueadoId }) } }] })

      let custosTotais = 0

      custos.forEach(custo => {
        custosTotais = custosTotais += ((custo.licencas * custo.valorLicenca) / 100)
      })

      allUsers.forEach(user => {
        user.espaco = user.espaco / Math.pow(1024, 2)
      }) 

      result = {
        allUsers: allUsers,
        allDisplays: allDisplays,
        displaysAtacado: null,
        displaysVarejo: null,
        totalUsers: allUsers.length,
        totalFaturamento: custosTotais,
        totalDisplay: allDisplays.length,
        usersFranquia: custos
      }
    }
    
    return res.json(result)
  } catch (err) {
    return console.log(err)

  }
})
.post('/', async function(req, res, next) {
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
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    role: req.body.role,
    espaco: tamanho
  })
  User.register(newUser, req.body.password, function (err, data) {
    if (err) {
      return res.json({ success: false, msg: err.message })

    } else {
      const newFranqueado = new UserFranqueado({
        userFranqueadoId: data._id,
        userFranqueadorId: null,
        licencas: req.body.licencas
      }).save();
      criaNovoBucket(data._id)
      return res.json({ success: true, msg: 'Usuário Cadastrado com Sucesso!' })
    }
  })

})

router
.patch('/:id', async function(req, res, next){
  const { id } = req.params
  try {
    let franqueado = await UserFranqueado.findOne({ userFranqueadoId: id })
    const user = await User.findById(id)
    if (!franqueado) {
      // return res.json({ success: false, msg: "Franqueado não Encontrado!" })
      await new UserFranqueado({
        userFranqueadoId: id,
        userFranqueadorId: null,
        licencas: req.body.licencas
      }).save();
      franqueado = await UserFranqueado.findOne({ userFranqueadoId: id })
    }
    if (!user)
      return res.json({ success: false, msg: "Usuario não Encontrado!" })

    if ('licencas' in req.body) franqueado.licencas = req.body.licencas
    if (req.body.password) {
      if (req.body.password.length < 6) return res.json({ success: false, msg: "Minimo de 6 digitos de senha exigido" })
      if (req.body.repeatSenha != req.body.password) return res.json({ success: false, msg: "As senhas digitadas não conferem" })
      await user.setPassword(req.body.password)
    }
    if ('espaco' in req.body) user.espaco = req.body.espaco * Math.pow(1024, 2)
    if ('name' in req.body) user.name = req.body.name
    if ('email' in req.body) user.email = req.body.email
    if ('username' in req.body) user.username = req.body.username
    if ('role' in req.body) user.role = req.body.role
    if ('ativo' in req.body && user.role === 'franqueador') {
      const franqueadosUser = await UserFranqueado.find({ userFranqueadorId: id })
      franqueadosUser.length > 0 && franqueadosUser.forEach(user => user.ativo = req.body.ativo) //desativo todos os user do franqueado...
      user.ativo = req.body.ativo
    } else if ('ativo' in req.body) user.ativo = req.body.ativo

    await franqueado.save()
    await user.save()

    return res.json({ success: true, msg: "Dados atualizados com sucesso!" })

  }
  catch (err) {
    console.log(err)
    return res.json({ success: false, msg: `${err}` })
  }
})
.delete('/:id', async function(req, res, next) {
  const { id } = req.params

  try {
    const user = await User.findById(id)

    if (user.role == 'franqueador') {
      const franqueados = await UserFranqueado.find({ userFranqueadorId: user._id })
      if (franqueados.length > 0) {
        await User.deleteMany({ _id: { $in: franqueados.map(result => { return result.userFranqueadoId }) } })
        await Display.deleteMany({ userId: { $in: franqueados.map(result => { return result.userFranqueadoId }) } })
        await Slideshow.deleteMany({ userId: { $in: franqueados.map(result => { return result.userFranqueadoId }) } })
        franqueados.forEach(franqueado => {
          deletaBucket(franqueado.userFranqueadoId)
        })
      }

    }
    const franqueado = await UserFranqueado.findOneAndDelete({ userFranqueadoId: id })
    const display = await Display.deleteMany({userId: id})
    const slideshow = await Slideshow.find({ userId: id })
    let slides = null;
    if (slideshow) {
      slides = await Slide.deleteMany({ slideshow: { $in: slideshow } })
      await Slideshow.deleteMany({ userId: id })
    }
    await User.deleteOne({_id: id})

    deletaBucket(id)
    return res.json({ success: true, msg: "Dados removidos com sucesso!" })


  } catch (err) {
    return res.json({ success: false, msg: `${err}` })

  }
})

module.exports = router
