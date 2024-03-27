const mongoose = require('mongoose')
const shortid = require('shortid')

const Schema = mongoose.Schema

const Device = new Schema({
  nome: {
    type: String,
    required: true,
  },
  codigo: {
    type: String,
    required: true,
    unique: true,
  },
  display: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Display', // Referência à coleção de Displays
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referência à coleção de Usuários (Users)
    required: true,
  },
  identificador: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Online', 'Offline', 'Inativo'],
    default: 'Inativo'
  },
}, {
  timestamps: true, // Adiciona os campos createdAt e updatedAt automaticamente
})

module.exports = mongoose.model('Device', Device)
