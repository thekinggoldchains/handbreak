import { Component } from 'react'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit} from '@fortawesome/free-solid-svg-icons'
import { view } from 'react-easy-state'

import Router from 'next/router'
import FranqueadosCreate from './FranqueadosCreate'
import { deletaFranqueado } from '../../../actions/user'
import { alerta } from '../../Toasts'
import styles from './styles.module.scss'

class FranqueadosCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      IsShowing: false,
    }
    this.dialog = React.createRef()
  }
  toggle = () => {
    this.setState({ IsShowing: !this.state.IsShowing })
  };

  open = e => {
    if (e) e.stopPropagation()
    this.dialog && this.dialog.current.open()
  }

  navigateToDisplay = (id) => {
    Router.push('/layout?display=' + id)
  }

  deleteData = (id) => {
    return deletaFranqueado(id).then((res) => {
        if (res.success == false) {
            alerta(res.msg, 'erro')
        } else {
            alerta(res.msg, '')
            this.props.refresh()
        }
    })
}

  static async getInitialProps({ query, req }) {
    const host =
      req && req.headers && req.headers.host ? 'https://' + req.headers.host : window.location.origin

    return { host }
  }


  render() {
    const { value, refresh = () => { }, host } = this.props
    return (
      <tr>
        <td><span className='title'>
          <button className='edit'>
            <FontAwesomeIcon
              icon={faEdit}
              fixedWidth
              color='#fff'
              onClick={this.open}
            />
          </button>
          <button className='delete'>
            <FontAwesomeIcon
              icon={faTrash}
              fixedWidth
              color='#fff'
              onClick={() => this.deleteData(value._id)}
            />
          </button>
        </span></td>
        <td><span className='title'>{value.name}</span></td>
        <td><span className='title'>{value.username}</span></td>
        <td><span className='title'>{value.email ? value.email : 'Não cadastrado'}</span></td>
        <td><span className='title'>{value.franquiaDetalhe.licencas}</span></td>
        <td><span className='title'>{value.telas.length}</span></td>
        <td><span className='title'>{value.espaco}MB</span></td>
        <td>
          <span className='title'>
            {value.role == 'admin' ? "Administrador" : value.role == 'user' ? "Padrão" : value.role == 'franqueador' ? 'Franqueador' : ''}
          </span>
        </td>
        <td><div className={value.ativo ? styles.active : styles.inative}> <span>{value.ativo ? "Ativo" : "Inativo"}</span></div></td>
            <FranqueadosCreate ref={this.dialog} data={value} refresh={refresh} />

        <style jsx>
          {`  
           td {
              padding: 12px 15px;
          }


          .title {
            font-family: 'Open Sans', sans-serif;
            font-size: 16px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #4f4f4f;
            margin-bottom: 8px;
          }

          .delete {
            background-color: #ff4040;
            padding: 10px;
            height: 28px;
            width: 35px;
            border-radius: 8px;
            border: none;
            margin-left: 8px;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .edit {
            background-color: #0044de;
            padding: 10px;
            height: 28px;
            width: 35px;
            border-radius: 8px;
            border: none;
            margin-left: 8px;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

            `}
        </style>
      </tr>
    )
  }
}

export default view(FranqueadosCard)
