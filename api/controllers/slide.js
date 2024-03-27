'use-strict'

const multer = require("multer")
const Slide = require("../models/Slide")
const CommonHelper = require('../helpers/common_helper')
const { deleteImage, uploadImage } = require("../services/firebase")



const upload = multer({
    storage: multer.memoryStorage(),
    limits: 1024 * 1024,
  })

module.exports = {
    updateSlide: async (req, res, next) => {
        const { id } = req.params
        Slide.findById(id)
            .then(slide => {
                if (!slide) return next(new Error('Slide not found'))
                upload.single('data')
                // await deleteImage(slide.data, '', '')
                deleteImage(slide.data, req.user._id, next)
                // Either the uploaded file if found or the text data field
                let data = '';
                if(req.body.type == 'photo' || req.body.type == 'video' ){
                    data = req.file.firebaseUrl
                }else{
                    data = req.body.data
                }
                if (data != null && typeof data != undefined) slide.data = data
                if ('type' in req.body) slide.type = req.body.type
                if ('title' in req.body) slide.title = req.body.title
                if ('description' in req.body) slide.description = req.body.description
                if ('duration' in req.body) slide.duration = req.body.duration

                return slide
                    .save()
                    .then(() => CommonHelper.broadcastUpdate(res.io, '', res))
                    .then(() => {
                        return res.json({ success: true })
                    })
            })
            .catch(err => next(err))
    }
}