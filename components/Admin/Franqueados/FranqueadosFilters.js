import { Component } from 'react'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { view } from 'react-easy-state'
import Router from 'next/router'
import styles from './styles.module.scss'
import FranqueadosCreate from './FranqueadosCreate'

class FranqueadosFilters extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShowing: false,
            filters: {
                emailFilter: '',
                nomeFilter: '',
                usernameFilter: '',
                ativoFilter: ''
              }
        }
        this.dialog = React.createRef()
        const options = [
            { label: "", value: "" },
            { label: "Ativo", value: "true" },
            { label: "Inativo", value: "false" }
          ];
    }
    toggle = () => {
        this.setState({ IsShowing: !this.state.IsShowing })
    };

    navigateToDisplay = (id) => {
        Router.push('/layout?display=' + id)
    }

    open = e => {
        if (e) e.stopPropagation()
        this.dialog && this.dialog.current.open()
      }

    static async getInitialProps({ query, req }) {
        const host =
            req && req.headers && req.headers.host ? 'https://' + req.headers.host : window.location.origin

        return { host }
    }




    limparCampos = () => {
        this.setState({
            filters: {
                emailFilter: '',
                nomeFilter: '',
                usernameFilter: '',
                ativoFilter: ''
            }
        })

        this.props.refresh();
    }


    render() {
        const { value, refresh = () => { }, host } = this.props
        return (
            <div className={styles.contentFilter}>
                <div className={styles.titleContent}>
                    <label className={styles.title}>Franqueados</label>
                    <button className={styles.submit} onClick={this.open}>
                        <FontAwesomeIcon icon={'plus'} />{' '}
                        <span> Novo</span>
                    </button>
                </div>
                <div className={styles.formContent}>
                    <input type={'text'} placeholder='E-mail' className={styles.input} value={this.state.filters.emailFilter}
                        onChange={(t) => this.setState({ filters: { ...this.state.filters, emailFilter: t.target.value } })} />
                    <input type={'text'} placeholder='Nome' className={styles.input} value={this.state.filters.nomeFilter}
                        onChange={(t) => this.setState({ filters: { ...this.state.filters, nomeFilter: t.target.value } })} />
                    <input type={'text'} placeholder='Username' className={styles.input} value={this.state.filters.usernameFilter}
                        onChange={(t) => this.setState({ filters: { ...this.state.filters, usernameFilter: t.target.value } })} />
                    <select className={`${styles.input} ${styles.select}`}
                        onChange={(t) => this.setState({ filters: { ...this.state.filters, ativoFilter: t.target.value } })}>
                        <option value={''}>Status</option>
                        <option value={true}>Ativo</option>
                        <option value={false}>Inativo</option>
                    </select>
                </div>
                <div className={styles.buttonContent}>
                    <button className={styles.clear} onClick={this.limparCampos}>
                        <span>Limpar</span>
                    </button>
                    <button className={styles.submit} onClick={() => this.props.filter(this.state.filters)}>
                        <FontAwesomeIcon icon={'search'} />
                        <span> Filtrar</span>
                    </button>
                </div>
                <FranqueadosCreate ref={this.dialog} />
            </div>
        )
    }
}

export default view(FranqueadosFilters)
