import BaseWidget from '../base_widget'
import TVContent from './src/TVContent'
import TVOptions from './src/TVOptions'

export default class TV extends BaseWidget {
  constructor() {
    super({
      name: 'TV',
      version: '0.1',
      icon: 'tv',
      defaultData: {
        title: null,
        url: 'https://sic.live.impresa.pt/sic540p.m3u8',
        color: '#95a5a6',
        fit: 'contain',
      }
    })
  }

  get Widget() {
    return TVContent
  }

  get Options() {
    return TVOptions
  }
}
