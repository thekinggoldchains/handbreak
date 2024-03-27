import { Component } from 'react'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faImages } from '@fortawesome/free-regular-svg-icons'
import { faTrash, faPlay, faTv, faUser, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { view } from 'react-easy-state'

import { deleteSlideshow } from '../../../actions/slideshow'
import { display } from '../../../stores'

import styles from './styles.module.scss'
import UsuarioCreate from './Forms/UsuarioCreate'
import FranqueadosCreate from '../Franqueados/FranqueadosCreate'

class DashboardMenu extends Component {

    constructor(props) {
        super(props)
        this.state = {
            cards: {
                userCard: true,
                displayCard: false,
                faturamentoCard: false
            },
        }
        this.dialog = React.createRef()
        this.dialogFranqueado = React.createRef()
    }

    create = e => {
        if (e) e.stopPropagation()
        this.dialog.current.open()
      }

    createFranqueado = e => {
        if (e) e.stopPropagation()
        this.dialogFranqueado.current.open()
    }

    render() {
        const { value, refresh = () => { }, colors, icons, titles } = this.props
        return (
            <div className={styles.cardMenu} style={{ backgroundColor: colors }}>
                <div className={styles.cardMenuBody}>
                    {display.user && display.user.role == 'admin' && (
                        <>
                            <button className={styles.menuActionButton} onClick={this.create} >
                                + <FontAwesomeIcon icon={'user'} /> <span>Novo usuario</span>
                            </button>
                            <button className={styles.menuActionButton} >
                                + <FontAwesomeIcon icon={'money-bill'} /> <span>Novo Lançamento (Em Breve)</span>
                            </button>
                        </>
                    )}
                    {display.user && display.user.role == 'franqueador' &&
                        (
                            <>
                                <button className={styles.menuActionButton} onClick={this.createFranqueado} >
                                    + <FontAwesomeIcon icon={'user'} /> <span>Novo Franqueado</span>
                                </button>

                            </>
                        )}
                </div>
                <UsuarioCreate ref={this.dialog} refresh={refresh} />
                <FranqueadosCreate ref={this.dialogFranqueado} data={value} refresh={refresh} />
            </div>
        )
    }
}

export default view(DashboardMenu)
