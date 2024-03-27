import { Component } from "react"
import React from 'react'
import ContentLoader from "react-content-loader"
import DashboardCards from "./DashboardCards"
import { getUsers } from "../../../actions/user"
import styles from './styles.module.scss'
import { faHdd, faUser } from "@fortawesome/free-regular-svg-icons"
import { faTv, faWallet } from "@fortawesome/free-solid-svg-icons"
import DashboardMenu from "./DashboardMenu"

class Faturamento extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [{}, {}, {}]
    }
    const colors = ['#214FB0', '#FC7C62', '#4982FC', '#B5FC30', '#81B02A']

  }

  componentDidMount() {
    // return getUsers().then(result => {
    //   this.setState({ users: result.usuarios })
    // })
  }

  async getUsers() {
    
    return getUsers().then(users => {
    })
  }

  render() {
    const { users } = this.state
    const {data, show} = this.props


    return (
      <div className={styles.list} style={{display: show ? 'block' : 'none'}}>
        <strong>Faturamento</strong>
      </div>
    )
  }

}

export default Faturamento