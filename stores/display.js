const ReactEasyState = require('react-easy-state')
const store = ReactEasyState.store
const _ = require('lodash')
const DisplayActions = require('../actions/display')
const UserAction = require('../actions/user')
const SlideAction = require('../actions/slide')
const shortid = require('shortid')
const { parseCookies, setCookie } = require('nookies')
const { alerta } = require('../components/Toasts')
const { default: Loading } = require('../components/Util/Loading')
const React = require('react');
const ReactDOM = require('react-dom');
const updateDisplayThrottled = _.debounce((id, data) => {
  return DisplayActions.updateDisplay(id, data)
}, 300)

const display = store({
  id: null,
  name: null,
  layout: null,
  statusBar: null,
  widgets: null,
  scale: null,
  user: null,
  displays: [],
  licencas: null,
  licencasUtilizadas: null,
  espacoUsado: {
    tamanho: 0,
    unidade: '',
    bytes: 0
  },
  espacoDisponivel: {
    tamanho: 0,
    unidade: '',
    bytes: 0
  },
  atingiuLimite: false,
  porcentagemUso: 0,
  storage: [],
  loading: false,
  showNotification: false,
  host: null,

  async setLoading(isLoading) {
    this.loading = isLoading;

    if (isLoading) {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.disabled = true;
      });
      const app = document.getElementById('loadingContent');
      app.style.display = 'block'
      app.style.width = '100%'
      app.style.height = '100%'
      app.style.position = 'absolute'
      app.style.zIndex = '9999999'

      const root = ReactDOM.createRoot(app);
      root.render(<Loading />);

    } else {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.disabled = false;
      });
      const container = document.getElementById('loadingContent');
      container.style.display = 'none'
    }

  },

  async setHost(host) {
    this.host = host
  },

  notification(message, show = true) {
    this.showNotification = show;

    if (this.showNotification) {
      this.openConfirmationModal(message);
    } else {
      this.closeConfirmationModal();
    }
  },

  openConfirmationModal(message) {
    this.confirmationModalOpen = true;
    this.confirmationModalMessage = message;
    this.confirmationModalResponse = false;
  },

  closeConfirmationModal() {
    this.confirmationModalOpen = false;
    this.confirmationModalMessage = '';
    this.confirmationModalResponse = false;
  },

  confirmAction() {
    this.confirmationModalResponse = true;
    this.closeConfirmationModal();
  },

  cancelAction() {
    this.confirmationModalResponse = false;
    this.closeConfirmationModal();
  },

  async verificaEspaco() {
    const res = {}
    const userId = parseCookies(res).loggedUserId
    let userInfo = {}
    if(userId) userInfo = await UserAction.getUser(userId);
    display.user = userInfo.usuarios
    display.licencas = userInfo.licencas ? userInfo.licencas.licencas : 1
    display.licencasUtilizadas = userInfo.telas?.length
    const espacoUso = await SlideAction.getUsedSpace();
    const espacoUsuario =  userInfo.usuarios ? userInfo.usuarios.espaco : 314572800 

    display.espacoUsado = {
      tamanho: espacoUso.data.tamanho ? espacoUso.data.tamanho : 0,
      unidade: espacoUso.data.unidade ? espacoUso.data.unidade : '',
      bytes: espacoUso.data.bytes,
    }
    display.espacoDisponivel = {
      tamanho: display.formatBytes(espacoUsuario),
      unidade: 'MB',
      bytes: espacoUsuario,
    }
    const dif = display.espacoDisponivel.bytes - display.espacoUsado.bytes
    if (display.espacoUsado.bytes) {
      display.porcentagemUso = ((display.espacoUsado.bytes * 100) / display.espacoDisponivel.bytes >= 100 ? 100 : (display.espacoUsado.bytes * 100) / display.espacoDisponivel.bytes);
    } else {
      display.porcentagemUso = 0;
    }

    display.atingiuLimite = dif <= 0

    if (display.user && !display.user.ativo) {
      alert('Seu login foi bloqueado, contate o administrador para regularizar.')
      await UserAction.logout()
    }
  },

  async getArquivos() {
    
    const arquivos = await SlideAction.getMidiaPorUser()
    arquivos.forEach(e => {
      let date = new Date(e.metadata.updated);
      e.metadata.updated = date.toLocaleString('pt-PT',);

    });
    display.storage.push(arquivos);
  },

  async deleteArquivo(item) {
    display.storage.splice(item, 1)
  },

  formatBytes(fileSizeInBytes) {
    var i = -1;
    var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  },


  async setId(id) {
    if (!id) return
    display.id = id
    const displayInfo = await DisplayActions.getDisplay(id)
    display.layout = displayInfo.layout
    display.statusBar = displayInfo.statusBar
    display.name = displayInfo.name
    display.widgets = displayInfo.widgets
    display.scale = displayInfo.scale
    let res = {}
    await setCookie(res, 'display', id)
  },
  setName(name) {
    if (!name) return
    display.name = name
  },
  updateName(name) {
    if (!name) return
    display.name = name
    updateDisplayThrottled(display.id, { name })
  },
  updateLayout(layout) {

    if (!layout || !['spaced', 'compact'].includes(layout)) return
    display.layout = layout
    updateDisplayThrottled(display.id, { layout })
  },
  updateScale(scale) {
    if (!scale || !['vertical', 'horizontal'].includes(scale)) return
    display.scale = scale
    updateDisplayThrottled(display.id, { scale })

  },
  addStatusBarItem(type) {
    display.statusBar = [...display.statusBar, type + '_' + shortid.generate()]
    updateDisplayThrottled(display.id, { statusBar: display.statusBar })
    return Promise.resolve()
  },
  removeStatusBarItem(id) {
    display.statusBar = [...display.statusBar.slice(0, id).concat(display.statusBar.slice(id + 1))]
    updateDisplayThrottled(display.id, { statusBar: display.statusBar })
  },
  reorderStatusBarItems(startIndex, endIndex) {
    const result = Array.from(display.statusBar)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    display.statusBar = result
    updateDisplayThrottled(display.id, { statusBar: display.statusBar })
  }
})

module.exports = display
