const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


const Schema = mongoose.Schema


const UserFranqueado = new Schema({
    userFranqueadoId: { type: Schema.Types.ObjectId, ref: 'User' },
    userFranqueadorId: { type: Schema.Types.ObjectId, ref: 'User' },
    licencas: {
        type: Number,
        default: 1
    },
    valorLicenca: {
        type: Number,
        default: 1000
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('UserFranqueado', UserFranqueado)
