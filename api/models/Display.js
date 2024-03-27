const mongoose = require('mongoose')
const shortid = require('shortid')

const Schema = mongoose.Schema

const orientacoes = ['vertical', 'horizontal']
const posicao = ['esquerda', 'direita']

const Display = new Schema({
  name: { type: String },
  layout: { type: String, default: 'spaced', enum: ['compact', 'spaced'] },
  statusBar: {
    type: [{ type: String }],
    default: () => []
  },
  widgets: [{ type: Schema.Types.ObjectId, ref: 'Widget' }],
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  scale: {type: String, enum: orientacoes, default: 'horizontal'},
  posicao: {type: String, enum: posicao, default: 'esquerda'},
})

module.exports = mongoose.model('Display', Display)
