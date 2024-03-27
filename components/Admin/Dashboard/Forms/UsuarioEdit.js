import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef, memo } from 'react'
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
import { display } from '../../../../stores'
import ControlledInput from '../../../Form/InputControll'

const UsuarioEdit = forwardRef((props, ref) => {

    const [form, setForm] = useState({})

    const dialogEdit = useRef(null);
    const [value, setValue] = useState('')

    useImperativeHandle(ref, () => {
        return {
            edit
        }
    })

    useEffect(() => {
        setaValores()
    }, [props.data])



    const setaValores = () => {
        const {
            _id
            , name
            , email
            , username
            , role
            , espaco
            , ativo
            , licencas
        } = props.data

        let valorMbUser;
        let valorLicencaUser;

        if (espaco == 300) {
            valorMbUser = 0
        } else {
            valorMbUser = ((espaco / 1000) * 0.50)
        }
        valorLicencaUser = 1000 * licencas

        props.data.valorMb = valorMbUser
        props.data.valorLicenca = valorLicencaUser


        setForm(props.data)
    }

    const edit = (e) => {

        if (e) e.stopPropagation()
        dialogEdit && dialogEdit.current && dialogEdit.current.open()
    }
    const close = e => {
        if (e) e.stopPropagation()

        return Promise.resolve().then(
            () => dialogEdit && dialogEdit.current && dialogEdit.current.close() && limpaState()
        )
    }

    const handleChange = (name, value) => {
        console.log(name, value)
        setForm({ ...form, [name]: value })
    }

    const refresh = () => {
        props.refresh()
    }

    const saveData = (id) => {
        const model = {
            name: form.name,
            email: form.email,
            username: form.username,
            password: form.password,
            role: form.role,
            espaco: form.espaco,
            licencas: form.licencas,
            ativo: form.ativo,
            repeatSenha: form.repeatSenha
        }

        return atualizaUsuario(id, model).then((res) => {
            if (res.success == false) {
                alerta(res.msg, 'erro')
            } else {
                alerta(res.msg, '')
                close()
                props.refresh()
                // location.reload()
            }
        })
    }


    const onchangeEspacoSlider = (valor) => {

        if (valor == 300) {
            setForm({ ...form, valorMb: 0, espaco: valor })
        } else {
            setForm({ ...form, valorMb: ((valor / 1000) * 0.50), espaco: valor })
        }
    }
    const onchangeLicencaSlider = (valor) => {
        if (valor <= 0) {
            return alerta("Não é permitido menos de 1 licença por usuário", 'erro')
        }
        setForm({ ...form, licencas: valor, valorLicenca: 1000 * valor })
    }

    const limpaState = () => {
        setName(""),
            setEmail(""),
            setUsername(""),
            setPassword(""),
            setRepeatSenha(""),
            setespaco(300),
            setLicencas(1),
            setAtivo(true),
            setValorMb(0),
            setValorLicenca(1000)
    }

    const choices = display.user?.role == 'admin' ?
        [
            { id: 'admin', label: 'Administrador' },
            { id: 'user', label: 'Padrão' },
            { id: 'franqueador', label: 'Group' },
            { id: 'teste', label: 'Teste Grátis' },

        ]
        :
        display.user?.role == 'franqueador' ?
            [
                { id: 'user', label: 'Padrão' },
                { id: 'franqueador', label: 'Group' },
                { id: 'teste', label: 'Teste Grátis' },
            ]
        :

            [
                { id: 'user', label: 'Padrão' },
            ]

    return (
        <div className={styles.modalContainer}>
            <Dialog ref={dialogEdit}>
                <Form>
                    <h3>Editar usuário {form.name}</h3>
                    {/* <h3>{data.name}</h3> */}
                    <div className={styles.form}>
                        <h3>Dados de cadastro e acesso</h3>

                        <InlineInputGroup>
                            <Input
                                inline={false}
                                label={'Nome do franqueado'}
                                type={'text'}
                                name={'name'}
                                value={form.name}
                                onChange={handleChange}
                            />
                            <Input
                                inline={false}
                                label={'E-mail'}
                                type={'text'}
                                name={'email'}
                                value={form.email}
                                onChange={handleChange}
                            />

                        </InlineInputGroup>
                        <InlineInputGroup>
                            <Input
                                inline={false}
                                label={'Username'}
                                type={'text'}
                                name={'username'}
                                value={form.username}
                                onChange={handleChange}
                            />
                            <Input
                                type={'select'}
                                inline={false}
                                name={'role'}
                                label={'Tipo de Usuario'}
                                value={form.role}
                                choices={choices}
                                onChange={handleChange}
                            />
                        </InlineInputGroup>
                        <InlineInputGroup>
                            <Input
                                inline={false}
                                label={'Senha'}
                                type={'password'}
                                name={'password'}
                                value={form.password}
                                onChange={handleChange}
                            />
                            <Input
                                inline={false}
                                label={'Repita a senha'}
                                type={'password'}
                                name={'repeatSenha'}
                                value={form.repeatSenha}
                                onChange={handleChange}
                            />
                        </InlineInputGroup>

                    </div>
                    <div className={`${styles.form} ${styles.formPrice}`}>
                        <div style={{ width: '50%' }}>
                            <h3>Cota de armazenamento <FontAwesomeIcon icon={faHdd} fixedWidth size='lg' color='#9900CC' /></h3>
                            <em>É a cota de espaço, onde o usuário poderá salvar imagens e videos próprios.</em>
                            <p><strong>{form.espaco}MB</strong></p>
                            <Slider
                                className={styles.slider}
                                min={300}
                                handleStyle={{ height: 15, marginTop: 0 }}
                                railStyle={{ height: 15 }}
                                style={{ height: 15 }}
                                dotStyle={{ height: 15 }}
                                trackStyle={{ height: 15 }}
                                activeDotStyle={{ height: 15 }}
                                onChange={onchangeEspacoSlider}
                                step={null}
                                value={form.espaco}
                                marks={{ 300: 'Grátis', 1000: '1GB', 2000: '2GB', 3000: '3GB', 4000: '4GB', 5000: '5GB', 6000: '6GB', 7000: '7GB', 8000: '8GB', 9000: '9GB', 10000: '(MAX)' }}
                                max={10000} />
                        </div>
                        <div className={styles.priceContent}>
                            <p className={styles.value}>{form.valorMb} </p>
                            <p className={styles.cifra}>€</p>
                        </div>
                    </div>

                    <div className={`${styles.form} ${styles.formPrice}`}>
                        <div style={{ width: '50%' }}>
                            <h3>Total de licenças {' '} <FontAwesomeIcon icon={faFileSignature} fixedWidth size='lg' color='#9900CC' /></h3>
                            <input
                                type={'number'}
                                className={styles.input}
                                value={form.licencas}
                                onChange={(e) => onchangeLicencaSlider(e.target.value)}
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
                                onChange={onchangeLicencaSlider}
                                value={form.licencas}
                                max={1000} />
                        </div>
                        <div className={styles.priceContent}>
                            <p className={styles.value}>{(1000 * form.licencas) / 100} </p>
                            <p className={styles.cifra}>€</p>
                        </div>
                    </div>

                    <div className={`${styles.form} ${styles.formPrice}`}>
                        <h3>Valor total mensal para o franqueado</h3>
                        <div className={styles.priceContent}>
                            <p className={styles.value}>{((form.valorLicenca / 100) + form.valorMb)} </p>
                            <p className={styles.cifra}>€</p>
                        </div>
                    </div>
                </Form>
                <ButtonGroup style={{ marginTop: 20 }}>
                    <p>Franqueado Ativo?</p>

                    <input type={'checkbox'}
                        size={25}
                        value={form.ativo}
                        checked={form.ativo}
                        onChange={() => {
                            const ativado = !form.ativo
                            setForm({
                                ...form,
                                ativo: ativado
                            })
                        }}
                    />
                    <Button text={'Save'} color={'#9900CC'} onClick={() => saveData(form._id)} />
                    <Button text={'Cancel'} color={'#e85454'} onClick={close} />
                </ButtonGroup>
            </Dialog>
        </div>
    )
    // }
})

export default UsuarioEdit
