const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Slide = new Schema({
  data: { type: String, default: '' },
  type: {
    type: String,
    default: 'photo',
    enum: ['photo', 'web', 'youtube', 'video', 'display', 'text']
  },
  fit: {
    type: String,
    default: 'contain'
  },
  title: { type: String },
  description: { type: String },
  duration: { type: Number, default: 5, min: 1 },
  slideshow: { type: Schema.Types.ObjectId, ref: 'Slideshow' },
  backgroundColor: { type: String, default: "#000" }
})

module.exports = mongoose.model('Slide', Slide)
