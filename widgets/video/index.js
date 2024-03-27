import BaseWidget from '../base_widget'
import YoutubeContent from './src/YoutubeContent'
import YoutubeOptions from './src/YoutubeOptions'

export default class Video extends BaseWidget {
  constructor() {
    super({
      name: 'Video',
      version: '0.1',
      icon: 'video',
      defaultData: {
        title: null,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        color: '#95a5a6',
        fit: '',
      }
    })
  }

  get Widget() {
    return YoutubeContent
  }

  get Options() {
    return YoutubeOptions
  }
}
