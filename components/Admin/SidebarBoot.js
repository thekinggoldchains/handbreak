import * as React from 'react';
import Router, { withRouter } from 'next/router';
import { view } from 'react-easy-state';


import styles from './sidebar.module.scss';
import Link from 'next/link';
import { display } from '../../stores'


import logo from '../../assets/icon4.png'
import logopqn from '../../assets/icon.ico'
import {
    faKey,
    faTv,
    faEye,
    faThLarge,
    faImages,
    faSignOutAlt,
    faHouseUser,
    faChartPie,
    faSitemap,
    faObjectUngroup,
    faHdd
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DropdownButton from '../DropdownButton';
import ButtonGroup from '../Form/ButtonGroup';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDisplays } from '../../actions/display';
import { parseCookies } from 'nookies';
import { logout } from '../../helpers/auth'

const navigateToAdmin = id => {
    Router.push('/layout?display=' + id)
    display.setId(id)
}
const Side = () => {
    const [displays, setDisplays] = useState([])
    const [role, setRole] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        display.verificaEspaco()

        const host = window.location.origin

        getDisplays(host).then(displays => {
            setDisplays(displays)
            setRole(parseCookies(null).role)
            display.displays = displays;           
        })
    }, [])

    const menu = [
        {
            id: 'home',
            name: 'Home',
            path: '/home?display='+ display.id,
            icon: faHouseUser
        },
        {
            id: 'users',
            name: 'Dashboard',
            path: '/dashboard?display=' + display.id,
            icon: faChartPie,
        },
        // {
        //     id: 'screen',
        //     name: 'Suas telas',
        //     path: '/screens?display=' + display.id,
        //     icon: faTv
        // },
        {
            id: 'layout',
            name: 'Encaixe de Widgets',
            path: '/layout?display=' + display.id,
            icon: faThLarge
        },
        // {
        //     id: 'preview',
        //     name: 'Prévia',
        //     path: '/preview?display=' + display.id,
        //     icon: faEye
        // },
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
    ]
    return (
        <aside className={`${styles.headerNavDesk} position-relative d-none d-lg-block`}  id='sidebar' onMouseEnter={() => { setIsOpen(true) }} onMouseLeave={() => { setIsOpen(false) }}>
            <nav className={`${styles.navItens} position-fixed d-flex flex-column p-4 pb-0`}>
                <div className={`overflow-auto ${styles.customScroll} h-100 d-flex flex-column justify-content-arround`}>
                    <div className="w-100 text-center" style={{ marginBottom: '5rem' }}>
                        <div className="cursor-pointer d-flex align-items-center flex-row justify-content-between position-relative">
                            <img src={logo} width='100%' className={`${styles.logoMenu} ${styles.logoNormal}`} />
                            <img src={logopqn} width='100%' className={`${styles.logoMenu} ${styles.logoNumber}`} />
                        </div>
                    </div>
                    <div className={`${styles.containerMenu}`}>
                        {
                            isOpen && (
                                <div onClick={() => {Router.push('/storage')}} className='mb-2' style={{cursor: 'pointer'}}>
                                    <label className='m-2'>Uso do Etag Cloud:</label>
                                    <div className="progress">
                                        <div className={`progress-bar ${display.porcentagemUso < 45 ? 'bg-success' : display.porcentagemUso < 75 ? 'bg-warning' : 'bg-danger'}`}
                                            role="progressbar" style={{ width: display.porcentagemUso < 10 ? '20%' : `${display.porcentagemUso}%` }}
                                            aria-valuenow={display.porcentagemUso} aria-valuemin="0" aria-valuemax="100">
                                            {display.porcentagemUso.toFixed(2)}%
                                        </div>
                                    </div>
                                    <div className='m-2 text-center'><em> {display.espacoUsado.tamanho} {display.espacoUsado.unidade} / {display.espacoDisponivel.tamanho}</em></div>

                                </div>
                            )
                        }
                        {
                            displays && displays.length > 0 && isOpen && (
                                    // <FontAwesomeIcon icon={faTv} fixedWidth /> 
                                    <DropdownButton
                                        onSelect={navigateToAdmin}
                                        choices={displays.map(display => ({
                                            key: display._id,
                                            name: display.name
                                        }))}
                                        menuStyle={{ left: 20, top: '70%' }}
                                    >
                                        <div className='logo border border-1 rounded p-4'>
                                            <div style={{marginRight: 15}}>
                                                <FontAwesomeIcon icon={faTv} fixedWidth={32} />
                                            </div>
                                            <div className='info'>
                                                <span className='name'>{display.name}</span>
                                            </div>
                                            <div className='caret'>
                                                <FontAwesomeIcon icon={'caret-down'} fixedWidth />
                                            </div>
                                        </div>
                                    </DropdownButton>
                            )
                        }

                        <ul className="d-flex align-items-start flex-column justify-content-between p-0 m-0">
                            {
                                menu.map(item => (
                                    <li className={`${styles.menuItens} mb-4 mt-4 ps-2 d-flex align-items-center`}>
                                        <Link href={item.path} style={{ color: '#FFF' }} className="cursor-pointer d-flex align-items-center flex-row justify-content-between">
                                            <div className={styles.link}>
                                                <FontAwesomeIcon icon={item.icon} fixedWidth className={`${styles.icons} me-4`} />
                                                <span className={styles.menuText}>{item.name}</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <ul className={`d-flex align-items-start flex-column justify-content-between p-0 m-0`}>
                        <li className={`${styles.menuItens} mb-4 mt-4 ps-2 d-flex align-items-center cursor-pointer `}>
                            <div onClick={() => logout()} style={{ color: '#FFF', cursor: 'pointer' }} className="d-flex align-items-center flex-row justify-content-between">
                                <div className={styles.link}>
                                    <FontAwesomeIcon icon={faSignOutAlt} fixedWidth className={`${styles.icons} me-4`} />
                                    <span className={styles.menuText}>Logout</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

            </nav>
            <style jsx >
                {
                    `
                    .logo {
                        display: flex;
                        flex-direction: row;
                        padding-right: 10px;
                        padding-left: 10px;
                        position: relative;
                        cursor: pointer;
                        border: 1px;
                        border-radius: 15px;
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
                    `
                }
            </style>
        </aside>
    );
}

export default withRouter(view(Side))