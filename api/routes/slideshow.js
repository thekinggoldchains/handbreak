const express = require('express')
const router = express.Router()
const arrayMove = require('array-move')

const Slideshow = require('../models/Slideshow')
const SlideshowHelper = require('../helpers/slideshow_helper')
const CommonHelper = require('../helpers/common_helper')
const Slide = require('../models/Slide')
const { parseCookies } = require('nookies')

// Route: /api/v1/slideshow/type/:tipo
router
  .get('/type/:tipo?', async (req, res, next) => {
    const userId = await parseCookies(res).loggedUserId
    const query = { userId: userId };
    const { tipo } = req.params;
    if (tipo !== 'undefined') {
      query.type = tipo
    }
    return Slideshow.find(query)
      .populate('slides')
      .then(slideshows => {
        return res.json(slideshows)
      })
      .catch(err => next(err))
  })
// Route: /api/v1/slideshow
router
.get('/', async (req, res, next) => {
  const userId = await parseCookies(res).loggedUserId
  return Slideshow.find({userId: userId, type: { $not: /^display.*/ }})
    .populate('slides')
    .then(slideshows => {
      return res.json(slideshows)
    })
    .catch(err => next(err))
})

  .post('/', (req, res, next) => {
    const userId = req.user._id 
    const tipo = req.body.type
    let model = {
      title: req.body.title,
      userId: userId,
      type: tipo
    }
    if(tipo=='display') {
      model.showProgress = false
    }
    const newSlideShow = new Slideshow(model)
    return newSlideShow
      .save()
      .then(slideshow => {
        if (!slideshow) {
          next(new Error('Slideshow not created'))
        }
        return CommonHelper.broadcastUpdate(res.io, '', res).then(() => res.json(slideshow))
      })
      .catch(err => next(err))
  })

// Route: /api/v1/slideshow/:id
router
  .get('/:id', (req, res, next) => {
    const { id } = req.params
    return Slideshow.findById(id)
      .populate('slides')
      .then(slideshow => {
        return res.json(slideshow)
      })
      .catch(err => next(err))
  })
  .get('/:id/slides', (req, res, next) => {
    const { id } = req.params
    return Slideshow.findById(id)
      .populate('slides')
      .then(slideshow => {
        return res.json({slides: slideshow.slides, slideshowOptions: slideshow })
      })
      .catch(err => next(new Error('Sem Id atribuido')))
  })
  .delete('/:id', (req, res, next) => {
    const { id } = req.params
    return Slideshow.findByIdAndDelete(id)
      .then(slideshow => {
        if (!slideshow) return next('Slideshow not found')
        return SlideshowHelper.deleteSlides(slideshow.slides, res).then(() => {
          return res.json({ success: true })
        })
      }).then(() => CommonHelper.broadcastUpdate(res.io, '', res))
      .catch(err => next(err))
  })
  .patch('/:id/reorder', (req, res, next) => {
    const { id } = req.params
    return Slideshow.findById(id)
      .then(slideshow => {
        if (!slideshow) return next(new Error('Slideshow not found'))

        const oldIndex = req.body.oldIndex
        const newIndex = req.body.newIndex
        const element = slideshow.slides[oldIndex];
        slideshow.slides.splice(oldIndex, 1);
        slideshow.slides.splice(newIndex, 0, element);
        // slideshow.slides = arrayMove(slideshow.slides, oldIndex, newIndex)

        return slideshow
          .save()
          .then(() => CommonHelper.broadcastUpdate(res.io, req.body.displayId))
          .then(() => {
            return res.json({ success: true })
          })
      })
      .catch(err => next(err))
  })
  .patch('/:id', (req, res, next) => {
    const { id } = req.params
    return Slideshow.findById(id)
      .then(slideshow => {
        if (!slideshow) return next(new Error('Slideshow not found'))

        if ('title' in req.body) slideshow.title = req.body.title
        if ('showProgress' in req.body) slideshow.showProgress = req.body.showProgress
        if ('speedRoll' in req.body) slideshow.speedRoll = req.body.speedRoll
        if ('slideshowType' in req.body) slideshow.slideshowType = req.body.slideshowType
        if ('directionRoll' in req.body) slideshow.directionRoll = req.body.directionRoll

        return slideshow
          .save()
          .then(() => CommonHelper.broadcastUpdate(res.io, req.body.displayId))
          .then(() => {
            return res.json({ success: true })
          })
      })
      .catch(err => next(err))
  })

  router.post('/clone/:id', async function (req, res, next) {
    try {
      const { id } = req.params;
      const slideshowId = id;
  
      // Passo 1: Criar o display clone
      var slideshowOriginal = Slideshow.findOne({
          _id: id,
      }).populate('slides');
      const newSlideshow = { ...slideshowOriginal };
      const newSlideshowId = mongoose.Types.ObjectId(); // Gera um novo ID
      newSlideshow._id = newSlideshowId; // Atualiza o ID do display
  
      await Slideshow.create(newSlideshow);
  
      console.log('Clonagem de slideshow concluída com sucesso!');
      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao clonar display:', error);
      next(error);
    }
  })

module.exports = router
