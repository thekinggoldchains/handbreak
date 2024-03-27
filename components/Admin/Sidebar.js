/**
 * @fileoverview Menu sidebar for the administrator pages, used to navigate the
 * admin interface and log out)
 */

import Link from 'next/link'
import { Component } from 'react'
import Router, { withRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faKey,
  faTv,
  faEye,
  faThLarge,
  faImages,
  faSignOutAlt,
  faHouseUser,
  faChartPie,
  faSitemap
} from '@fortawesome/free-solid-svg-icons'
import DropdownButton from '../DropdownButton'
import { view } from 'react-easy-state'

import { logout } from '../../helpers/auth'
import { display } from '../../stores'
import { getDisplays } from '../../actions/display'
import { parseCookies } from 'nookies'
import { faHdd, faObjectUngroup } from '@fortawesome/free-regular-svg-icons'
import logo from '../../assets/001.png'

class Sidebar extends Component {

  constructor(props) {
    super(props)

    this.state = {
      displays: props.displays || [],
      role: props.role || 'user',
      space: props.userSpace,
      franqueados: []
    }


  }


  componentDidMount() {
    const host = window.location.origin

    display.verificaEspaco()


    getDisplays(host).then(displays => {
      this.setState({ displays, role: parseCookies(null).role })
    })

  }

  static async getInitialProps({ req, res }) {
    const roles = req.user.role
    const capacity = req
    return this.setState({ role: req.user.role, userId: req.user._id })
  }


  navigateToAdmin = id => {
    Router.push('/layout?display=' + id)
    display.setId(id)
  }

  render() {
    const { router, loggedIn } = this.props
    const { displays, role, space, franqueados } = this.state
    const menu = loggedIn
      ? [
        {
          id: 'home',
          name: 'Home',
          path: '/',
          icon: faHouseUser
        },
        {
          id: 'users',
          name: 'Dashboard',
          path: '/dashboard?display=' + display.id,
          icon: faChartPie,
        },
        {
          id: 'screen',
          name: 'Suas telas',
          path: '/screens?display=' + display.id,
          icon: faTv
        },
        {
          id: 'layout',
          name: 'Encaixe de Widgets',
          path: '/layout?display=' + display.id,
          icon: faThLarge
        },
        {
          id: 'preview',
          name: 'Prévia',
          path: '/preview?display=' + display.id,
          icon: faEye
        },
        {
          id: 'slideshow',
          name: 'Slideshows',
          path: '/slideshows?display=' + display.id,
          icon: faImages
        },
        {
          id: 'multidisplay',
          name: 'MultiDisplay',
          path: '/multidisplay?display=' + display.id,
          icon: faSitemap
        },
        {
          id: 'canva',
          name: 'Etag Canva (Beta)',
          path: '/canva?display=' + display.id,
          icon: faObjectUngroup
        },
      ] :
      [
        {
          id: 'login',
          name: 'Login',
          path: '/login?display=' + display.id,
          icon: faKey
        }
      ]
    return (
      <div className='sidebar'>
        <div className='logoContainer'>
          <img
            className='logoImg'
            src={logo}
          />
        </div>
        {loggedIn && (
          <>
            <DropdownButton
              onSelect={this.navigateToAdmin}
              choices={displays.map(display => ({
                key: display._id,
                name: display.name
              }))}
              style={{ marginTop: 20, marginBottom: 20 }}
              menuStyle={{ left: 20, top: '70%' }}
            >
              <div className='logo'>
                <div className='icon'>
                  <FontAwesomeIcon icon={faTv} fixedWidth color='#9900CC' />
                </div>
                <div className='info'>
                  <span className='name'>{display.name}</span>
                  <span className='status online'>online</span>
                </div>
                <div className='caret'>
                  <FontAwesomeIcon icon={'caret-down'} fixedWidth />
                </div>
              </div>
            </DropdownButton>
          </>
        )}

        <ul className='menu'>
          {loggedIn && (
            <div className='info-espaco-container'>
              <span className='info-espaco'>Espaço Usado: </span>
              <span className='info-espaco'>
                {display.espacoUsado.tamanho} {display.espacoUsado.unidade} / {display.espacoDisponivel.tamanho}</span>
              <div className='progress-barra'>
                <div className='barContainer'>
                  <div className='completedContainerBar'>
                    <div className='completedBar'></div>
                  </div>
                  <div className='labelContainerBar'><span className='gerenciar'>{display.porcentagemUso.toFixed(2)}%</span></div>
                </div>

              </div>
              <div className='gerenciar-content'>
                <FontAwesomeIcon icon={faHdd} fixedWidth />
                <a className='gerenciar' href={'/storage?display=' + display.id}>Gerenciar Espaço</a>
              </div>
            </div>
          )}
          {menu.map(item => (
            (item.role == role || item.role == null) &&
            <li className={item.path == router.pathname && 'active'} key={item.path}>
              <a href={item.path} style={{textDecoration: 'none', color: '#4f4f4f'}}>
                <FontAwesomeIcon icon={item.icon} fixedWidth />
                <span className={'text'}>
                  {'   '}
                  {item.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
        {loggedIn && (
          <div className='logout' onClick={() => logout()}>
            <a>
              <FontAwesomeIcon icon={faSignOutAlt} fixedWidth />
              <span className={'text'}>{'   Sair'}</span>
            </a>
          </div>
        )}
        <style jsx>
          {`
            a {
              text-decoration: none !important;
              color: #4f4f4f !important;
            }
            .logoContainer {
              align-items: center;
              justify-content: center;
              flex-direction: row;
              display: flex;
              padding: 5px;
              background-color: #9900CC;
            }
            .logoTextContainer {
              display: flex;
              justify-content: center;
              width: 100%;
              align-items: center;
            }
            .logoText{
              font-family: 'Grape Nuts', cursive;
              font-size: 24px;
              font-weight: bold;
              color: #e4e3fb;
            }
            .logoImg {
              height: 100px;
            }
            .barContainer{
              display: flex;
              justify-content: space-between;
              align-items: center;
              border: 2px solid rgba(0,0,0,.15);
              border-radius: 20px;
              height: 30px;
              padding: 0 10px;
            }
            .completedContainerBar {
              width: 100%;
              display: flex; 
              background-color: rgba(0,0,0,.15);
              height: 15px;
              border-radius: 20px !important;
              margin-right: 5px;
            }
            .completedBar{
              background-color: ${display.porcentagemUso < 60 ? '#22bb33' : display.porcentagemUso < 80 ? '#f0ad4e' : '#bb2124'};
              width: ${display.porcentagemUso.toFixed(2) < 6.0 ? 6.0 : display.porcentagemUso.toFixed(2)}%;
              height: 15px;
              border-radius: 15px;
            }
            .progress-barra {
              margin-top: 10px;
              width: 100%;
            }
            .sidebar {
              border-radius: 0 30px 0 0;
              min-width: 300px;
              max-width: 300px;
              min-height: 100vh;
              background: #fff;
              display: flex;
              flex-direction: column;
              box-shadow: .5rem rgba(0,0,0,.15);
            }
            .progress-barra span {
              font-family: 'Open Sans',sans-serif;
              font-size: 16px;
            }
            .info-espaco-container {
              padding: 10px;
            }
            .info-espaco {
              text-transform: uppercase;
              font-family: 'Open Sans',sans-serif;
              font-size: 16px;
              font-weight: 600;
              color: #4f4f4f;
            }
            .gerenciar-content {
              margin-top: 10px;
              display: flex;
              justify-content: flex-end;
            }
            .gerenciar-content a:active,
            .gerenciar-content a:hover {
              background: #f0f0f0;
              cursor: pointer;
              transition: all .2s ease-in-out;
            }
            .gerenciar {
              font-family: 'Open Sans',sans-serif;
              font-size: 12px;
              font-weight: 600;
              color: #4f4f4f;
              text-decoration: none;
            }
            .menu {
              list-style: none;
              padding: 0px;
              margin: 0px;
              display: flex;
              flex-direction: column;
              flex: 1;
              width: 100%;
            }
            .menu li,
            .logout {
              padding: 20px;
              text-transform: uppercase;
              font-family: 'Open Sans', sans-serif;
              font-size: 16px;
              font-weight: 600;
              color: #4f4f4f;
            }
            .menu li.active,
            .menu li:hover,
            .logout:hover {
              background: #f0f0f0;
              cursor: pointer;
              transition: all .2s ease-in-out
            }
            .menu li .text {
              margin-left: 8px;
            }
            .logo {
              display: flex;
              flex-direction: row;
              padding-right: 10px;
              padding-left: 10px;
              position: relative;
              cursor: pointer;
            }
            .logo .icon {
              min-width: 3em;
              min-height: 3em;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              transform: scale(2);
            }
            .logo .info {
              font-family: 'Open Sans', sans-serif;
              display: flex;
              flex-direction: column;
              justify-content: center;
              white-space: nowrap;
              overflow: hidden;
            }
            .logo .info .name {
              font-weight: 600;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .logo .info .status.online {
              color: #9900CC;
            }
            .logo .info .status.online::before {
              content: '•';
              color: #9900CC;
              font-size: 32px;
              vertical-align: middle;
              line-height: 16px;
              padding-right: 4px;
            }
            .logo .caret {
              position: absolute;
              top: 50%;
              margin-top: -8px;
              right: 16px;
            }
            @media only screen and (max-width: 900px) {
              .sidebar {
                min-width: 0px;
              }
              .logo .info {
                display: none;
              }
              .logo .icon {
                min-width: 0px;
                min-height: 0px;
                transform: scale(1);
              }
              .logo {
                margin: 0px;
                padding: 0px;
              }
              .menu li .text,
              .logout .text {
                display: none;
              }
            }
          `}
        </style>
      </div>
    )
  }
}

export default withRouter(view(Sidebar))
