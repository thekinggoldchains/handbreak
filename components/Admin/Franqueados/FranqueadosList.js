import { Component } from "react"
import React from 'react'
import ContentLoader from "react-content-loader"
import FranqueadosCard from "./FranqueadosCard"
import { getFranqueadosUsers, getUsers } from "../../../actions/user"
import FranqueadosFilters from "./FranqueadosFilters"
import { alerta } from "../../Toasts"

class FranqueadosList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: []
    }
  }

  componentDidMount() {
    this.refresh();
  }

  async getUsers() {
    
    return getFranqueadosUsers().then(users => {
    })
  }

  filter = (itemFilter) => {
    let filter = {
      name: itemFilter.nomeFilter,
      email: itemFilter.emailFilter,
      username: itemFilter.usernameFilter,
      ativo: itemFilter.ativoFilter
    }
    
    if(filter.name == '' && filter.email == '' && filter.username == '' && filter.ativo == ''){
      return alerta("Digite algum campo para filtrar", 'erro')
    }

    const filtersUsers = this.state.users.filter(user => {
      return Object.keys(filter).every(propertyName => user[propertyName].toString().includes(filter[propertyName]));
    });

    if( filtersUsers.length == 0) return alerta("Sem resultados", 'erro')

    this.setState({
      users: filtersUsers
    })
  }

  refresh = () => {
    getFranqueadosUsers().then(result => {
      this.setState({ users: result.usuarios })
    })
  }

  render() {
    const { users } = this.state


    return (
      <div className={'list'}>
        <FranqueadosFilters filter={(filters) => this.filter(filters)} refresh={this.refresh}  />
        <table className="styled-table">
          <thead>
            <tr>
              <th><strong>Ações</strong></th>
              <th><strong>Nome Usuario</strong></th>
              <th><strong>Username</strong></th>
              <th><strong>Email</strong></th>
              <th><strong>Licenças Totais</strong></th>
              <th><strong>Licenças Criadas</strong></th>
              <th><strong>Espaço contratado</strong></th>
              <th><strong>Tipo de usuario</strong></th>
              <th><strong>Status</strong></th>
            </tr>
          </thead>
          <tbody>
            {users
              ? users.map((value, index) => (
                <FranqueadosCard
                  key={`item-${index}`}
                  index={index}
                  value={value}
                  refresh={this.refresh}
                />
              ))
              : Array(4)
                .fill()
                .map(() => (
                  <ContentLoader height={120} width={640}>
                    <rect x='0' y='0' rx='5' ry='5' width='100%' height='80' />
                  </ContentLoader>
                ))}
          </tbody>
        </table>

        <style jsx>
          {`
            .styled-table {
              border-collapse: collapse;
              margin: 25px 0;
              font-size: 0.9em;
              font-family: sans-serif;
              width: 100%;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            }
            .styled-table thead tr {
              background-color: #9900CC;
              color: #ffffff;
              text-align: left;
          }
          .styled-table th,
          .styled-table td {
              padding: 12px 15px;
          }
              `}
        </style>
      </div>
    )


  }

}

export default FranqueadosList