import React, { Component } from 'react'
import Dialog from '../../../Dialog'
import { Form, Button, ButtonGroup, Input, InlineInputGroup } from '../../../Form'
import { atualizaFranqueado, criaFranqueado, deletaFranqueado } from '../../../../actions/user'
import styles from '../styles.module.scss'
import Slider, { Range } from 'rc-slider';
import { alerta } from '../../../Toasts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd } from '@fortawesome/free-regular-svg-icons'
import { faFileSignature } from '@fortawesome/free-solid-svg-icons'
import { atualizaUsuario, criaUsuario } from '../../../../actions/dashboard'

class UsuarioCreate extends Component {
    constructor(props) {
        super(props)

        const {
            _id
            , name
            , email
            , username
            , role
            , password
            , repeatSenha
            , espaco
            , ativo
            , valorMb
            , valorLicenca } = props.data || {}
        // const { licencas } = props.data?.franquiaDetalhe || {}
        this.state = {
            _id: null || _id,
            name: name || "",
            email: email || "",
            role: role || null,
            username: username || "",
            password: "",
            repeatSenha: "",
            espaco: espaco || 300,
            licencas:  1,
            ativo: ativo,
            valorMb: 0,
            valorLicenca: 1000
        }
        this.dialog = React.createRef()

    }

    open = (e) => {
        if (e) e.stopPropagation()
        this.dialog.current.open()
    }
    closeCreate = e => {
        return Promise.resolve().then(
            () => this.dialog.current?.close() && this.limpaState()
        )
    }

    handleChange = (name, value) => {
        this.setState({
            [name]: value
        })

    }

    saveData = (id, refresh) => {
        const model = {
            name: this.state.name,
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            role: this.state.role,
            espaco: this.state.espaco,
            licencas: this.state.licencas,
            ativo: this.state.ativo,
            repeatSenha: this.state.repeatSenha
        }

        return !id ? criaUsuario(model).then((res) => {
            if (res.success == false) {
                alerta(res.msg, 'erro')
            } else {
                alerta(res.msg, '')
                this.closeCreate()
                this.props.refresh()
            }
        }) : atualizaUsuario(id, model).then((res) => {
            if (res.success == false) {
                alerta(res.msg, 'erro')
            } else {
                alerta(res.msg, '')
                this.closeCreate()
                this.props.refresh()
            }
        })
    }


    onchangeEspacoSlider = (valor) => {
        this.setState({
            espaco: valor

        })

        if (valor == 300) {
            this.setState({
                valorMb: 0
            })
        } else {
            this.setState({
                valorMb: ((valor / 1000) * 0.50)
            })
        }
    }
    onchangeLicencaSlider = (valor) => {
        if (valor <= 0) {
            return alerta("Não é permitido menos de 1 licença por usuário", 'erro')
        }
        this.setState({
            licencas: valor,
            valorLicenca: 1000 * valor
        })
    }

    limpaState = () => {
        this.setState({
            name: "",
            email: "",
            username: "",
            senha: "",
            repeatSenha: "",
            espaco: 300,
            licencas: 1,
            ativo: true,
            valorMb: 0,
            valorLicenca: 1000
        })
    }


    componentDidMount() {

        this.onchangeEspacoSlider(this.state.espaco)
        // this.onchangeLicencaSlider(this.state.licencas)
    }

    componentDidUpdate() {
    }

    render() {
        const { refresh = () => { } } = this.props
        const { _id, name, email, username, role, repeatSenha, password, ativo, espaco, licencas, valorMb, valorLicenca } = this.state
        return (
            <div className={styles.modalContainer}>
                <Dialog ref={this.dialog}>
                    <Form>
                        <h3>Criar novo usuário</h3>
                        <div className={styles.form}>
                            <h3>Dados de cadastro e acesso</h3>

                            <InlineInputGroup>
                                <Input
                                    inline={false}
                                    label={'Nome do franqueado'}
                                    type={'text'}
                                    name={'name'}
                                    value={name}
                                    onChange={this.handleChange}
                                />
                                <Input
                                    inline={false}
                                    label={'E-mail'}
                                    type={'text'}
                                    name={'email'}
                                    value={email}
                                    onChange={this.handleChange}
                                />

                            </InlineInputGroup>
                            <InlineInputGroup>
                                <Input
                                    inline={false}
                                    label={'Username'}
                                    type={'text'}
                                    name={'username'}
                                    value={username}
                                    onChange={this.handleChange}
                                />
                                <Input
                                    type={'select'}
                                    inline={false}
                                    name={'role'}
                                    label={'Tipo de Usuario'}
                                    value={role}
                                    choices={[
                                        { id: 'admin', label: 'Administrador' },
                                        { id: 'user', label: 'Padrão' },
                                        { id: 'franqueador', label: 'Group' },
                                        { id: 'teste', label: 'Teste Grátis' },
                                    ]}
                                    onChange={this.handleChange}
                                />
                            </InlineInputGroup>
                            <InlineInputGroup>
                                    <Input
                                        inline={false}
                                        label={'Senha'}
                                        type={'password'}
                                        name={'password'}
                                        value={password}
                                        onChange={this.handleChange}
                                        />
                                    <Input
                                        inline={false}
                                        label={'Repita a senha'}
                                        type={'password'}
                                        name={'repeatSenha'}
                                        value={repeatSenha}
                                        onChange={this.handleChange}
                                        />
                            </InlineInputGroup>

                        </div>
                        <div className={`${styles.form} ${styles.formPrice}`}>
                            <div style={{ width: '50%' }}>
                                <h3>Cota de armazenamento <FontAwesomeIcon icon={faHdd} fixedWidth size='lg' color='#9900CC' /></h3>
                                <em>É a cota de espaço, onde o usuário poderá salvar imagens e videos próprios.</em>
                                <p><strong>{espaco}MB</strong></p>
                                <Slider
                                    className={styles.slider}
                                    min={300}
                                    handleStyle={{ height: 15, marginTop: 0 }}
                                    railStyle={{ height: 15 }}
                                    style={{ height: 15 }}
                                    dotStyle={{ height: 15 }}
                                    trackStyle={{ height: 15 }}
                                    activeDotStyle={{ height: 15 }}
                                    onChange={this.onchangeEspacoSlider}
                                    step={null}
                                    value={espaco}
                                    marks={{ 300: 'Grátis', 1000: '1GB', 2000: '2GB', 3000: '3GB', 4000: '4GB', 5000: '5GB', 6000: '6GB', 7000: '7GB', 8000: '8GB', 9000: '9GB', 10000: '(MAX)' }}
                                    max={10000} />
                            </div>
                            <div className={styles.priceContent}>
                                <p className={styles.value}>{valorMb} </p>
                                <p className={styles.cifra}>€</p>
                            </div>
                        </div>

                        <div className={`${styles.form} ${styles.formPrice}`}>
                            <div style={{ width: '50%' }}>
                                <h3>Total de licenças {' '} <FontAwesomeIcon icon={faFileSignature} fixedWidth size='lg' color='#9900CC' /></h3>
                                <input
                                    type={'number'}
                                    className={styles.input}
                                    value={licencas}
                                    defaultValue={licencas}
                                    onChange={(e) => this.onchangeLicencaSlider(e.target.value)}
                                />

                                <Slider
                                    className={styles.slider}
                                    min={1}
                                    handleStyle={{ height: 15, marginTop: 0 }}
                                    railStyle={{ height: 15 }}
                                    style={{ height: 15 }}
                                    dotStyle={{ height: 15 }}
                                    trackStyle={{ height: 15 }}
                                    activeDotStyle={{ height: 15 }}
                                    onChange={this.onchangeLicencaSlider}
                                    value={licencas}
                                    max={1000} />
                            </div>
                            <div className={styles.priceContent}>
                                <p className={styles.value}>{(1000 * licencas) / 100} </p>
                                <p className={styles.cifra}>€</p>
                            </div>
                        </div>

                        <div className={`${styles.form} ${styles.formPrice}`}>
                            <h3>Valor total mensal para o franqueado</h3>
                            <div className={styles.priceContent}>
                                <p className={styles.value}>{((valorLicenca / 100) + valorMb)} </p>
                                <p className={styles.cifra}>€</p>
                            </div>
                        </div>
                    </Form>
                    <ButtonGroup style={{ marginTop: 20 }}>
                        <p>Franqueado Ativo?</p>

                        <input type={'checkbox'}
                            size={25}
                            value={ativo}
                            checked={ativo}
                            onChange={() => {
                                const ativado = !ativo
                                this.setState({
                                    ativo: ativado
                                })
                            }}
                        />
                        <Button text={'Save'} color={'#9900CC'} onClick={() => this.saveData(_id, refresh)} />
                        <Button text={'Cancel'} color={'#e85454'} onClick={this.closeCreate} />
                    </ButtonGroup>
                </Dialog>
            </div>
        )
    }
}

export default UsuarioCreate
