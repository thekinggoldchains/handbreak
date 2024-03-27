import BaseWidget from '../base_widget'
import AnnouncementContent from './src/AnnouncementContent'
import AnnouncementOptions from './src/AnnouncementOptions'

export default class Announcement extends BaseWidget {
  constructor() {
    super({
      name: 'Anúncio',
      version: '0.1',
      icon: 'exclamation-triangle',
      defaultData: {
        text: '',
        textSize: 16,
        color: '#708090',
        textColor: '#ffffff',
        titleColor: '#fff0f0',
        titleSize: 18,
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
