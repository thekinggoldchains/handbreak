import { Component } from 'react'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faImages } from '@fortawesome/free-regular-svg-icons'
import { faTrash, faPlay, faTv, faUser, faEdit } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { view } from 'react-easy-state'

import { deleteSlideshow } from '../../../actions/slideshow'
import { display } from '../../../stores'

import styles from './styles.module.scss'

class DashboardCards extends Component {

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
  }

  render() {
    const { value, change = () => { }, colors, icons, titles, active, id, show } = this.props
    return (
      <div
      className={styles.card} 
      style={{ backgroundColor: colors, display: !show ? 'none' : ''}}
      >
        <div className={styles.cardIcon}>
          <span><FontAwesomeIcon icon={icons} /></span>
        </div>
        <div className={styles.cardText}>
          <p>{titles}</p>
          <h2>{value}</h2>
        </div>

      </div>
    )
  }
}

export default view(DashboardCards)
