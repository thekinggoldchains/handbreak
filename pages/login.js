import { Component } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTv, faCheck, faTimes, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { view } from 'react-easy-state'

import Frame from '../components/Admin/Frame.js'
import { login } from '../helpers/auth.js'
import { display } from '../stores'
import { alerta } from '../components/Toasts.js'
import Head from 'next/head.js'
import banner from '../assets/bannerLogin.png'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      alert: null,
      host: ''
    }
  }

  static async getInitialProps({ query, req, res }) {
    const host =
      req && req.headers && req.headers.host
        ? 'https://' + req.headers.host
        : window.location.origin

    const displayId = query && query.display
    return { displayId }
  }

  componentDidMount() {
    const { displayId } = this.props
    display.setId(displayId)
  }

  performLogin = () => {
    const { username, password } = this.state
    const { displayId, host } = this.props
    login({ username, password }, host, displayId)
      .then(resp => {
        if (!resp.success) return alerta(`Erro: ${resp.msg}`, 'erro')
        alerta('Logado com sucesso!', '')
      })
      .catch((err) => {
        alerta(`Username ou senha errados.`, 'erro')
      })
  }

  usernameChangeHandler = event => {
    this.setState({
      username: event.target.value
    })
  }

  passwordChangeHandler = event => {
    this.setState({
      password: event.target.value
    })
  }

  render() {
    const { loggedIn } = this.props
    const { alert } = this.state
    return (
      <>
        <Head>
          <title>Etag Digital - Login</title>
        </Head>
        <div className='formContainer'>
          <div className='col-lg-12 d-flex justify-content-center p-2'>
            <div className='col-lg-4 card-login'>
              <div className='logo'>
                <img className='logoimg' alt='' src={require('../assets/icon2.png')} />
              </div>
              <form
                onSubmit={event => {
                  event.preventDefault()
                  this.performLogin()
                  return false
                }}
              >
                <input
                  style={{height: '3.5rem'}}
                  type='text'
                  className='form-control mb-1'
                  id='floatingUsername'
                  onChange={this.usernameChangeHandler}
                  placeholder="Usuário"
                />
                <input
                  style={{height: '3.5rem'}}
                  type='password'
                  className='form-control mb-3'
                  id='floatingPassword'
                  onChange={this.passwordChangeHandler}
                  placeholder="Senha"
                />
                <div className='btn-login-container'>
                  <button className='btn btn-lg btn-primary btn-login'>Log In.</button>
                </div>
              </form>
            </div>
          </div>

        </div>
        <style jsx>
          {`
           .formContainer {
             height: 100vh;
             width: 100vw;
             margin: auto;
             display: flex !important;
             justify-content: center;
             flex-direction: column;
             background: url(${banner}) no-repeat center center fixed;
            }
            .card-login {
              background: rgba(255,255,255, 0.5);
              padding: 1rem;
              border-radius: 0.5rem
            }
            @media (max-width: 990.00px) {
              .formContainer {
                padding: 40px;
              }
            }
            .btn-login-container {
              display: flex;
              width: 100%;
              justify-content: center;
            }
            .btn-login {
              width: 80%;
            }
            h1 {
              font-family: 'Open Sans', sans-serif;
              font-size: 24px;
              color: #4f4f4f;
              margin: 0px;
            }
            .logo {
              display: flex;
              margin-top: 20px;
              margin-bottom: 20px;
              align-self: center;
              justify-content: center;
              align-items: center;
            }
            .logoimg{
              width: 30%;
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
            .form {
              background: white;
              border-radius: 8px;
              display: flex;
              flex-direction: column;
              padding: 24px;
              font-family: 'Open Sans', sans-serif;
            }
            .form input[type='text'],
            .form input[type='password'] {
              outline: none;
              background: #ededed;
              border-radius: 8px;
              font-family: 'Open Sans', sans-serif;
              font-weight: 400;
              font-size: 16px;
              color: #928f8f;
              border: none;
              padding: 8px;
              height: 32px;
              min-width: 256px;
              vertical-align: middle;
              -webkit-appearance: none;
              margin-bottom: 16px;
            }
            .form button {
              outline: none;
              background: #9900CC;
              border-radius: 8px;
              font-family: 'Open Sans', sans-serif;
              font-weight: 600;
              font-size: 18px;
              color: #ffffff;
              text-align: center;
              border: none;
              padding: 4px;
              height: 48px;
              vertical-align: middle;
              padding-left: 16px;
              padding-right: 16px;
              -webkit-appearance: none;
            }
            .form label {
              padding-bottom: 16px;
            }
            .back {
              display: inline-block;
              margin: 16px;
              font-family: 'Open Sans', sans-serif;
              color: #6f6e6e;
              font-size: 14;
              cursor: pointer;
            }
            .alert-error {
              background: #e74c3c;
              border-radius: 6px;
              margin-bottom: 16px;
              padding: 16px;
            }
            .alert-info {
              background: #3ca9e7;
              border-radius: 6px;
              margin-bottom: 16px;
              padding: 16px;
            }
            .alert-success {
              background: #9900CC;
              border-radius: 6px;
              margin-bottom: 16px;
              padding: 16px;
            }
            .alert-text {
              color: white;
              margin-left: 8px;
            }
            
          `}
        </style>
      </>
    )
  }
}

export default view(Login)
