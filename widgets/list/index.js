import BaseWidget from '../base_widget'
import ListContent from './src/ListContent'
import ListOptions from './src/ListOptions'

export default class List extends BaseWidget {
  constructor() {
    super({
      name: 'Lista',
      version: '0.1',
      icon: 'list',
      defaultData: {
        title: null,
        color: '#34495e',
        textColor: '#ffffff',
        fontTitle: 18,
        list: [{ text: '', label: null, fontText: 16, fontLabel: 12 }]
      }
    })
  }

  get Widget() {
    return ListContent
  }

  get Options() {
    return ListOptions
  }
}
