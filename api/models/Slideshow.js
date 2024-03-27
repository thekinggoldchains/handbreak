const mongoose = require('mongoose')
const Schema = mongoose.Schema

const types = ['normal', 'roll']
const typesData = ['slide', 'display']
const speed = [100, 200, 300, 400 ]

const Slideshow = new Schema({
  title: { type: String },
  slides: [{ type: Schema.Types.ObjectId, ref: 'Slide' }],
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  showProgress: { type: Boolean, default: true },
  slideshowType: {type: String, enun: types, default: 'normal'},
  speedRoll: { type: Number, enun: speed, default: 200},
  directionRoll: { type: String, default: 'right'},
  type: { type: String, enun: typesData,  default: 'slide'},
})

module.exports = mongoose.model('Slideshow', Slideshow)
