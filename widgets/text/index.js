import BaseWidget from '../base_widget'
import AnnouncementContent from './src/AnnouncementContent'
import AnnouncementOptions from './src/AnnouncementOptions'

export default class Text extends BaseWidget {
  constructor() {
    super({
      name: 'Texto',
      version: '0.1',
      icon: 'text-height',
      defaultData: {
        text: '',
        textSize: 18,
        textFont: `'Open-Sans', sans-serif`,
        color: '#708090',
        textColor: '#ffffff',
        titleColor: '#fff0f0',
        accentColor: '#EDC951'
      }
    })
  }

  get Widget() {
    return AnnouncementContent
  }

  get Options() {
    return AnnouncementOptions
  }
}
