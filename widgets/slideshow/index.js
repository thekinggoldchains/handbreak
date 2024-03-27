import BaseWidget from '../base_widget'
import SlideshowContent from './src/Slideshow.js'
import SlideshowOptions from './src/SlideshowOptions.js'

export default class Slideshow extends BaseWidget {
  constructor() {
    super({
      name: 'Slideshow',
      version: '0.1',
      icon: 'play',
      defaultData: {
        slideshowType: 'normal',
        speedRoll: 200,
        directionRoll: 'right',
        showProgress: true,
      }
    })
  }

  get Widget() {
    return SlideshowContent
  }

  get Options() {
    return SlideshowOptions
  }
}
