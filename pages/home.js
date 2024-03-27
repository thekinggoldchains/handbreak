import React from 'react'
import Link from 'next/link'
import Router from 'next/router'

import { getDisplays } from '../actions/display'
import { view } from 'react-easy-state'
import { logout, protect } from '../helpers/auth'
import display, {verificaEspaco } from '../stores/display'
import ListaDisplay from '../components/Admin/Home/ListaDisplay'
import ListaSlides from '../components/Admin/Home/ListaSlides'
import SidebarBoot from '../components/Admin/SidebarBoot'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Frame from '../components/Admin/Frame'
import ListaDispositivo from '../components/Admin/Home/ListaDispositivos'
import ListaMidia from '../components/Admin/Home/ListaMidias'



class Home extends React.Component {
  constructor(props) {
    super(props)
    this.screenList = React.createRef()
    this.state = {
      displays: props.displays || [],
      host: '',
      displayId: ''
    }

    this.onGetDisplays(this.state.host)
  }


  onGetDisplays = async(host) => {
    await getDisplays(host).then((res) => {
      this.setState({
        displays: res,
        displayId: res[0]._id
      })
    }).catch((err) => {console.log(err.message)})
  }

  componentDidMount() {
    verificaEspaco();
    if ('serviceworker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => {
          console.log("Service Worker Registrado!", reg)
        })
        .catch(err => {
          "Erro Service Worker!", err.message
        });
    }
  }

  static async getInitialProps({ req }) {
    const host =
      req && req.headers && req.headers.host ? 'https://' + req.headers.host : window.location.origin
    return { host: host }
  }

  navigateToDisplay = id => {
    Router.push('/display/' + id)
  }

  render() {
    const { displays = [], displayId } = this.state
    
    return (
      <Frame loggedIn={this.props.loggedIn}>
      <div className='d-flex justify-content-between px-5 py-3 cinza'>

        <div className=' ml-5 col-md-12'>
          <div className='d-flex row'>
            <ListaDispositivo/>
            <ListaDisplay />
            <ListaSlides />
          </div>
        </div>


        <style jsx>
          {`
          .cinza {
            background-color: #f4f4f4 !important;
            height: 100% !important;
          }
          `}
        </style>
      </div>
      </Frame>
    )
  }
}

export default protect(view(Home))
