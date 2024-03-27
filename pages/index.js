import React from 'react'
import Link from 'next/link'
import Router from 'next/router'

import { getDisplays } from '../actions/display'
import { view } from 'react-easy-state'
import { logout, protect } from '../helpers/auth'
import display, {displays, verificaEspaco } from '../stores/display'
import ListaDisplay from '../components/Admin/Home/ListaDisplay'
import ListaSlides from '../components/Admin/Home/ListaSlides'
import SidebarBoot from '../components/Admin/SidebarBoot'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Frame from '../components/Admin/Frame'
import ListaDispositivo from '../components/Admin/Home/ListaDispositivos'
import ListaMidia from '../components/Admin/Home/ListaMidias'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDesktop, faTv, faUser } from '@fortawesome/free-solid-svg-icons'



class Index extends React.Component {
  constructor(props) {
    super(props)
    this.screenList = React.createRef()
    this.state = {
      displays: props.displays || [],
      host: '',
      displayId: ''
    }
  }




  static async getInitialProps({ req }) {
    const host =
      req && req.headers && req.headers.host ? 'https://' + req.headers.host : window.location.origin
      display.setHost(host)
    return { host: host}
  }

  redirect = route => {
    Router.push('/' + route + "?display=" + display.id)
  }

  render() {
    const { displays = [], displayId } = this.state

    return (
      <div className='d-flex px-5 py-3 cinza align-items-center'>

        <div className='d-flex justify-content-center h-25 row col-md-12'>
          <div className='card col-md-3 me-4 justify-content-center align-items-center' onClick={() => this.redirect('device')} >
            <FontAwesomeIcon className='mb-4' icon={faDesktop} size={'4x'} />
            Continuar como Dispositivo
          </div>
          <div className='card col-md-3 justify-content-center align-items-center' onClick={() => this.redirect('home')}>
            <FontAwesomeIcon className='mb-4' icon={faUser} size={'4x'} />
            Ir para Admin
          </div>
        </div>

        <style jsx>
          {`
          .cinza {
            background-color: #f4f4f4 !important;
            height: 100vh !important;
          }
          .card {
            border: 0;
            box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2);
            font-size: 18px;
            cursor: pointer;
            transition: all 0.2s ease-out;
          }
          .card:hover {
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            font-size: 24px;

          }
        `}
      </style>
    </div>
    )
  }
}

export default protect(view(Index))
