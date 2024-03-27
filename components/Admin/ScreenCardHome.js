import { Component } from 'react'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowRestore } from '@fortawesome/free-regular-svg-icons'
import { faChromecast } from '@fortawesome/free-brands-svg-icons'
import { faTrash, faTv, faEye, faLink, faPlay, faEdit } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { view } from 'react-easy-state'

import { deleteDisplay } from '../../actions/display'

class ScreenCardHome extends Component {
  render() {
    const { value, refresh = () => {} } = this.props
    return (
      <Link href={'/display/' + value._id}>
        <div className='card'>
          <div className='left'>
            <div className={'thumbnail'}>
              <FontAwesomeIcon icon={faTv} fixedWidth size='lg' color='#9900CC' />
            </div>
          </div>
          <div className='middle'>
            <div className='title'>{value.name || 'Untitled Display'}</div>
            <div className='info'>
              <div className='widgetnum'>
                <div className='icon'>
                  <FontAwesomeIcon icon={faWindowRestore} fixedWidth color='#878787' />
                </div>
                <span className='text'>{value.widgets.length} widgets</span>
              </div>
              <div className='clientnum'>
                <div className='icon'>
                  <FontAwesomeIcon icon={faChromecast} fixedWidth color='#878787' />
                </div>
                <span className='text'>1 client paired</span>
              </div>
              <div className='online'>
                <span className='text'>online</span>
              </div>
            </div>
          </div>
          <div className='right'>
            <Link href={'/layout?display=' + value._id}>
              <div className='actionIcon'>
                <FontAwesomeIcon icon={faEdit} fixedWidth color='#878787' />
              </div>
            </Link>
            <Link href={'/display/' + value._id}>
              <div className='actionIcon'>
                <FontAwesomeIcon icon={faPlay} fixedWidth color='#9900CC' />
              </div>
            </Link>
            
          </div>
          <style jsx>
            {`
              .card {
                padding: 12px;
                font-family: 'Open Sans', sans-serif;
                border-radius: 4px;
                cursor: pointer;
                background: white;
                margin-top: 40px;
                margin-bottom: 40px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                position: relative;
                z-index: 1;
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

              .left {
                font-family: 'Open Sans', sans-serif;
                justify-content: center;
                padding-left: 8px;
                padding-right: 8px;
              }

              .info {
                display: flex;
                flex-direction: row;
              }

              .widgetnum,
              .online,
              .clientnum {
                font-family: 'Open Sans', sans-serif;
                font-size: 14px;
                color: #878787;
                margin-right: 8px;
              }

              .widgetnum .icon,
              .online .icon,
              .clientnum .icon {
                margin-right: 4px;
                display: inline;
                vertical-align: middle;
              }

              .widgetnum .text,
              .online .text,
              .clientnum .text {
                vertical-align: middle;
              }

              .online {
                color: #9900CC;
              }

              .online::before {
                content: '•';
                color: #9900CC;
                font-size: 32px;
                vertical-align: middle;
                line-height: 16px;
                padding-right: 4px;
              }

              .middle {
                font-family: 'Open Sans', sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-left: 8px;
                padding-right: 8px;
                flex: 1;
                min-width: 0;
              }

              .right {
                display: flex;
                flex-direction: row;
                font-family: 'Open Sans', sans-serif;
                justify-content: center;
                align-items: center;
                padding-left: 8px;
                padding-right: 8px;
              }

              .thumbnail {
                height: 60px;
                width: 60px;
                background-size: cover;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              .actionIcon {
                margin-right: 16px;
                margin-left: 16px;
              }
            `}
          </style>
        </div>
      </Link>
    )
  }
}

export default view(ScreenCardHome)
