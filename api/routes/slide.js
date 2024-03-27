const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { uploadImage, deleteImage, getTotalSpaceUsed, getFilesByUser, deleteGenerico, deleteMultiple } = require('../services/firebase')


const CommonHelper = require('../helpers/common_helper')
const Slide = require('../models/Slide')
const SlideHelper = require('../helpers/slide_helper')
const { updateSlide } = require('../controllers/slide')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: multer.memoryStorage(),
    limits: 1024 * 1024,
})

router
    .get('/video', async function (req, res, next) {
        const link = req.query.link;
        console.log(link)
        try {
            // Faça a solicitação para obter o blob
            const response = await fetch(link);

            if (response.status !== 200) {
                throw new Error('Erro ao buscar o blob');
            }

            // Obtenha o corpo da resposta como ArrayBuffer
            const arrayBuffer = await response.arrayBuffer();

            // Converta o ArrayBuffer em um buffer do Node.js
            const blobBuffer = Buffer.from(arrayBuffer);

            // Defina os cabeçalhos da resposta, incluindo o 'Content-Type'
            res.setHeader('Content-Type', response.headers.get('content-type'));
            res.setHeader('Content-Length', blobBuffer.length);

            // Envie o blob de volta como parte da resposta
            res.json(blobBuffer);
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao buscar o blob');
        }
});

// Route: /api/v1/slide
router
    .get('/', (req, res, next) => {
        return Slide.find({})
            .then(slides => {
                if (!slides) {
                    res.sendStatus(500)
                    return res.send('No slides found')
                }
                return res.json(slides)
            })
            .catch(err => next(err))
    })
    .post('/', upload.single('data'), uploadImage, (req, res, next) => {
        try {

            if (req.body.slideshow == undefined)
                return next(new Error('Missing Slideshow ID, slide not added'))
            // Either the uploaded file if found or the text data field
            const data = req.file ? req.file.firebaseUrl : req.body.data
            const model = {
                data: data,
                type: req.body.type,
                title: req.body.title,
                description: req.body.description,
                duration: req.body.duration,
                slideshow: req.body.slideshow
            }
            if ('backgroundColor' in req.body) model.backgroundColor = req.body.backgroundColor;

            const newSlide = new Slide(model);

            return SlideHelper.addSlide(newSlide, res, next, req)


        } catch (err) {
            return next(err)
        }
    })

// Route: /api/v1/slide/standalone_upload
router.post('/standalone_upload', upload.single('data'), uploadImage, (req, res, next) => {
    try {


        if (!req.file && !req.file.path) return next(new Error('Missing file upload'))

        return res.json({ success: true, url: req.file.firebaseUrl })
    } catch (error) {
        return next(error)
    }
})

router.get('/usedSpace', getTotalSpaceUsed, (req, res, next) => {
    try {
        return res
    } catch (error) {
        return next(error)
    }
})
router.get('/midias', getFilesByUser, (req, res, next) => {
    try {

        return res
    } catch (error) {
        return next(error)
    }
})
router.post('/deletaRecurso', (req, res, next) => {
    try {
        console.log("chegou aqui")
        return deleteImage(req.body.url, req.user._id, next).then(() => {
            return res.json({ sucess: true })
        })
    } catch (error) {
        return next(error)
    }
})

router.post('/deletaMultiple', async (req, res, next) => {
    try {
        for (let index = 0; index < req.body.url.length; index++) {
            const element = req.body.url[index];
            console.log(element);
            await deleteMultiple(element, req.user._id, next).then(() => { })
        }
        return res.json({ sucess: true })
    } catch (error) {
        return next(error)
    }
})

// Route: /api/v1/slide/:id
router
    .get('/:id', (req, res, next) => {
        const { id } = req.params
        return Slide.findById(id)
            .then(slide => {
                if (!slide) return next(new Error('Slide not found'))
                return res.json(slide)
            })
            .catch(err => next(err))
    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params
        return Slide.findByIdAndRemove(id)
            .then(slide => {
                if (!slide) return next(new Error('Slide not found'))
                deleteImage(slide.data, req.user._id, next)
                return SlideHelper.deleteSlide(slide, next, res)
            })
            .catch(err => next(err))
    })
    .patch('/:id', upload.single('data'), uploadImage, (req, res, next) => {
        const { id } = req.params

        if (req.file) {
            return Slide.findById(id)
                .then(slide => {
                    if (!slide) return next(new Error('Slide not found'))
                    upload.single('data')
                    deleteImage(slide.data, req.user._id, next)
                    // Either the uploaded file if found or the text data field
                    let data = '';
                    if (req.body.type == 'photo' || req.body.type == 'video') {
                        data = req.file.firebaseUrl
                    } else {
                        data = req.body.data
                    }
                    if (data != null && typeof data != undefined) slide.data = data
                    if ('type' in req.body) slide.type = req.body.type
                    if ('title' in req.body) slide.title = req.body.title
                    if ('description' in req.body) slide.description = req.body.description
                    if ('duration' in req.body) slide.duration = req.body.duration
                    if ('fit' in req.body) slide.fit = req.body.fit
                    if ('backgroundColor' in req.body) slide.backgroundColor = req.body.backgroundColor

                    return slide
                        .save()
                        .then(() => CommonHelper.broadcastUpdate(res.io, '', res))
                        .then(() => {
                            return res.json({ success: true })
                        })
                })
                .catch(err => next(err))
        }
        else {
            Slide.findById(id)
                .then(slide => {
                    if ('type' in req.body) slide.type = req.body.type
                    if ('data' in req.body) slide.data = req.body.data
                    if ('title' in req.body) slide.title = req.body.title
                    if ('description' in req.body) slide.description = req.body.description
                    if ('duration' in req.body) slide.duration = req.body.duration
                    if ('fit' in req.body) slide.fit = req.body.fit
                    if ('backgroundColor' in req.body) slide.backgroundColor = req.body.backgroundColor
                    return slide
                        .save()
                        .then(() => CommonHelper.broadcastUpdate(res.io, '', res))
                        .then(() => {
                            return res.json({ success: true })
                        })
                })
                .catch(err => next(err))
        }
    })

router
    .post('/display', (req, res, next) => { })

module.exports = router
