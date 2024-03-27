import React, { Component } from 'react'
import { Form, Input, InlineInputGroup, Button} from '../../../components/Form'
import { standaloneUpload } from '../../../actions/slide'
import StorageMidias from '../../../components/Admin/Storage/StorageMidias'
import { faHdd } from '@fortawesome/free-regular-svg-icons'
import {CloudArrowUp, Database} from 'react-bootstrap-icons';
import { ButtonGroup, InputGroup } from 'react-bootstrap'
import { alerta } from '../../../components/Toasts'
import { display } from '../../../stores'

class ImageOptions extends Component {
  constructor(props) {
    super(props)
    const { title, color, fit, url } = props.data || {}
    this.state = {
      title,
      color,
      fit,
      url
    }
    this.dialogStorage = React.createRef();
  }

  handleChange = async (name, value) => {
    const { onChange = () => {} } = this.props
    if (name == 'upload') {
      name = 'url'
      this.setState({loading: true})
      display.setLoading(true)
      const resp = await standaloneUpload(value)
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
    this.setState({loading: false})
    display.setLoading(false)

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


  render() {
    const { title, color, fit, url } = this.state
    return (
      <div className={'container'}>
        <Form>
          <p>Use uma imagem de sua galeria de arquivos, ou faça um novo upload.</p>
          <InlineInputGroup>
            <Input
              inline={false}
              label={'Background'}
              type={'color'}
              name={'color'}
              value={color}
              onChange={this.handleChange}
              expand={false}
            />
            <Input
              inline={false}
              label={'Title (Optional)'}
              type={'text'}
              name={'title'}
              placeholder={'Opções de Titulo...'}
              value={title}
              onChange={this.handleChange}
              expand={true}
            />
          </InlineInputGroup>
          <InlineInputGroup>
            <Input
              className={'form-control form-control-lg'}
              inline={false}
              label={'URL'}
              type={'text'}
              name={'url'}
              value={url}
              onChange={this.handleChange}
            />
            <Input
              className={'form-select'}
              inline={false}
              label={'Image fit'}
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
          <InlineInputGroup>
            <button
              className='btn btn-outline-primary'
              onClick={() => this.abreStorage()}>
              <Database width={32} />
              Buscar nos meus arquivos
            </button>
            <input type='file' accept='image/*' id='upload' hidden onChange={this.abreWindows} />
            <button className='btn btn-outline-primary' onClick={() => { document.getElementById('upload').click() }}>
              {
                this.state.loading ?

                  (
                    "Fazendo upload..."
                  ) :
                  (
                    <>
                      <CloudArrowUp width={32} />
                      Fazer novo upload de imagem
                    </>
                  )
              }
            </button>

          </InlineInputGroup>
        </Form>
        <StorageMidias ref={this.dialogStorage} ehVideos={false} onSelectImageStorage={(url) => this.onSelectImageStorage(url)} />
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

export default ImageOptions
