const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const crypto = require("crypto");


const Schema = mongoose.Schema

const roles = ['user', 'admin', 'franqueador', 'teste']


const User = new Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        index: true,
        trim: true
    },
    services: {
        facebook: String,
        google: String
    },
    role: {
        type: String,
        enum: roles,
        default: 'user'
    },
    picture: {
        type: String,
        trim: true
    },
    espaco: {
        type: Number,
        default: 314572800
    },
    logoSrc:{
        type: String,
        default: 'https://s3-dc2.mspclouds.com/administradores/logo.png'
    },
    ativo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

User.path('email').set(function (email) {
    if (!this.picture || this.picture.indexOf('https://gravatar.com') === 0) {
      const hash = crypto.createHash('md5').update(email).digest('hex')
      this.picture = `https://gravatar.com/avatar/${hash}?d=identicon`
    }
  
    if (!this.name) {
      this.name = email.replace(/^(.+)@.+$/, '$1')
    }
  
    return email
  })

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)
