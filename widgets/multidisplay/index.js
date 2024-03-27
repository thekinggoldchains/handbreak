import BaseWidget from '../base_widget'
import SlideshowContent from './src/Slideshow.js'
import SlideshowOptions from './src/SlideshowOptions.js'

export default class Multidisplay extends BaseWidget {
    constructor() {
        super({
            name: 'Multidisplay',
            version: '0.1',
            icon: 'sitemap',
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
