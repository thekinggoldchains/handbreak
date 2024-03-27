import React, { Component } from 'react'
import { CloudArrowUp, Database } from 'react-bootstrap-icons'
import { standaloneUpload } from '../../../actions/slide'
import StorageMidias from '../../../components/Admin/Storage/StorageMidias'
import { Button, ButtonGroup, Form, InlineInputGroup, Input } from '../../../components/Form'
import { alerta } from '../../../components/Toasts'
import display from '../../../stores/display'
import socketIOClient from 'socket.io-client';
import {parseCookies} from 'nookies'

class YoutubeOptions extends Component {
  constructor(props) {
    super(props)
    const { title, color, url, fit } = props.data || {}
    this.state = {
      title,
      color,
      url,
      fit,
      loading: false
    }
    this.dialogStorage = React.createRef();
    this.throttledRefresh = display.setLoading(false);
  }

  componentDidMount() {
    const userId = parseCookies(null).loggedUserId;
    console.log(userId);
    const socket = socketIOClient(process.env.HOST)
    socket.on(`upload_complete:${userId}`, (data) => {
      display.setLoading(false)
    })
  }

  abreStorage = () => {
    this.dialogStorage.current.edit()
  }
  abreWindows = (event) => {
    const file = Object.assign(event.target.files[0], {
      preview:
        URL && URL.createObjectURL
          ? URL.createObjectURL(event.target.files[0])
          : typeof window !== 'undefined' && window.webkitURL
          ? window.webkitURL.createObjectURL(event.target.files[0])
          : null
    })
    this.handleChange('upload', file)
  }

  onSelectImageStorage = (url) => {
    this.handleChange('url', url)
  }


  handleChange = async (name, value) => {
    const { onChange = () => { } } = this.props
    if (name == 'upload') {
      if (value.size > 104857600) {
        return alerta("Para o melhor funcionamento, arquivos maiores que 100MB não são permitidos", 'erro')
      }
      name = 'url'
      this.setState({ loading: true })
      display.setLoading(true)
      const resp = await standaloneUpload(value)
      this.setState({ loading: false })
      value = resp.data.url
    }
    this.setState(
      {
        [name]: value
      },
      () => {
        onChange(this.state)
      }
    )

  }

  render() {
    const { title, color, url, loading, fit } = this.state
    return (
      <div className={'container'}>
        <Form>
          <h3>Widget: Video</h3>
          <Input
              inline={false}
              label={'Video'}
              type={'text'}
              name={'url'}
              value={url}
              onChange={this.handleChange}
              />
          <InlineInputGroup>
            <button
              className='btn btn-outline-primary'
              onClick={() => this.abreStorage()}>
              <Database width={32} />
              Buscar nos meus arquivos
            </button>
            <input type='file' accept='video/*' id='upload' hidden onChange={this.abreWindows} />
            <button className='btn btn-outline-primary' onClick={() => { document.getElementById('upload').click() }}>
              {
                this.state.loading ?

                  (
                    "Fazendo upload..."
                  ) :
                  (
                    <>
                      <CloudArrowUp width={32} />
                      Fazer novo upload de video
                    </>
                  )
              }
            </button>

          </InlineInputGroup>
          <InlineInputGroup>
            <Input
              inline={false}
              label={'Cor de Fundo'}
              type={'color'}
              name={'color'}
              value={color}
              onChange={this.handleChange}
            />
            <Input
              inline={false}
              label={'Video Fit'}
              type={'select'}
              name={'fit'}
              value={fit}
              choices={[
                { label: 'Zoom-in (Cover)', id: 'cover' },
                { label: 'Fit to Container', id: 'contain' }
              ]}
              onChange={this.handleChange}
              expand={false}
            />
          </InlineInputGroup>
          <Input
            inline={false}
            label={'Titulo do Widget'}
            type={'text'}
            name={'title'}
            value={title}
            placeholder={'Opções de Titulo...'}
            onChange={this.handleChange}
          />
        </Form>
        <StorageMidias ref={this.dialogStorage} ehVideos={true} onSelectImageStorage={(url) => this.onSelectImageStorage(url)} />

        <style jsx>
          {`
            h3,
            p {
              font-family: 'Open Sans', sans-serif;
            }
            .container {
              display: flex;
              flex-direction: column;
            }
          `}
        </style>
      </div>
    )
  }
}

export default YoutubeOptions
