import { Component } from "react"
import React from 'react'
import ContentLoader from "react-content-loader"
import DashboardCards from "./DashboardCards"
import { getDashboard } from "../../../actions/dashboard"
import styles from './styles.module.scss'
import { faHdd, faUser } from "@fortawesome/free-regular-svg-icons"
import { faTv, faWallet } from "@fortawesome/free-solid-svg-icons"
import DashboardMenu from "./DashboardMenu"
import Usuarios from "./Usuarios"
import Displays from "./Displays"
import Faturamento from "./Faturamento"
import { display } from '../../../stores'

class DashboardList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {},
      userActive: true,
      faturamentoActive: false,
      displaysActive: false
    }
    const colors = ['#214FB0', '#FC7C62', '#4982FC', '#B5FC30', '#81B02A']
  }

  componentDidMount() {
    this.getDashboard()
  }

  refresh = () => {
    this.getDashboard();
  }

  async getDashboard() {
    return getDashboard().then(result => {
      this.setState({
        data: result
      })
    })
  }

  async changeChildren(children) {
    switch (children) {
      case 0:
        this.setState({
          userActive: true,
          faturamentoActive: false,
          displaysActive: false
        })
        break;
      case 1:
        this.setState({
          userActive: false,
          faturamentoActive: true,
          displaysActive: false
        })
        break;
      case 2:
        this.setState({
          userActive: false,
          faturamentoActive: false,
          displaysActive: true
        })
        break;
      default: null
        break;
    }
  }

  render() {
    const { users, userActive, displaysActive, faturamentoActive } = this.state


    return (
      <div className={styles.list}>
        <DashboardMenu
          colors={"transparent"}
          icons={faTv}
          titles={"Menu"}
          refresh={this.refresh}
        />
        <div className={styles.cards}>
          <DashboardCards
            value={this.state.data.totalUsers}
            icons={faUser}
            colors={"#f9ac34"}
            titles={"Meus Usuários"}
            show={true}
            id={0}
            change={(value) => this.changeChildren(value)}
          />
          <DashboardCards
            value={`${this.state.data.totalFaturamento ? this.state.data.totalFaturamento : 0}€`}
            colors={"#e967b5"}
            icons={faWallet}
            show={display && display.user ? display.user.role == "admin" : false}
            titles={"Faturamento"}
            id={1}
            change={(value) => this.changeChildren(value)}
          />
          <DashboardCards
            value={`${this.state.data.totalFaturamento ? this.state.data.totalFaturamento : 0}€`}
            colors={"#e967b5"}
            icons={faTv}
            titles={"Custos totais"}
            show={display.user ? (display.user.role == "user" || display.user.role == "franqueador") : false}
            id={3}
            change={(value) => this.changeChildren(value)}
          />
          <DashboardCards
            value={this.state.data.totalDisplay}
            colors={"#9a53c8"}
            icons={faTv}
            titles={"Displays"}
            show={true}
            id={2}
            change={(value) => this.changeChildren(value)}
          />
        </div>

        <div className={styles.chartsCard}>
          <Usuarios data={this.state.data} show={userActive} refresh={this.refresh}/>
        </div>
      </div>
    )
  }

}

export default DashboardList