import React from 'react'
import _ from 'lodash'

import Dialog from '../Dialog'
import { Form, Input, Button, ButtonGroup } from '../Form'

import { getSlide, addSlide, updateSlide, standaloneUpload } from '../../actions/slide'
import display, { verificaEspaco } from '../../stores/display'
import dynamic from 'next/dynamic'
import ReactHtmlParser from 'react-html-parser';
import { parseCookies } from 'nookies'
import socketIOClient from 'socket.io-client'
import { CloudArrowUp } from 'react-bootstrap-icons'


const CustomEditor = dynamic(() => import('../CustomEditor'), { ssr: false })

class SlideEditDialog extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      upload: props.upload,
      ...(props.upload ? { type: 'photo' } : {})
    }
  }

  componentDidMount() {
    this.refresh()
    const userId = parseCookies(null).loggedUserId;
    console.log(userId);
    const socket = socketIOClient(process.env.HOST)
    socket.on(`upload_complete:${userId}`, (data) => {
      display.setLoading(false)
    })
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.upload != prevProps.upload) {
      this.setState({
        upload: this.props.upload,
        ...(this.props.upload ? { type: 'photo' } : {})
      })
    }
  }

  refresh = () => {
    const { slide, upload } = this.props
    if (slide) {
      return getSlide(slide).then(data => {
        this.setState({
          data: undefined,
          title: undefined,
          description: undefined,
          type: undefined,
          duration: undefined,
          fit: undefined,
          ...data,
          upload,
          ...(upload ? { type: 'photo' } : {})
        })
      })
    } else {
      this.setState({
        data: undefined,
        title: undefined,
        description: undefined,
        type: undefined,
        duration: undefined,
        fit: undefined,
        upload,
        ...(upload ? { type: 'photo' } : {})
      })
      return Promise.resolve()
    }
  }

  open = () => {
    this.refresh()
    this.dialog && this.dialog.open()
  }

  close = () => {
    const { refresh } = this.props
    this.dialog && this.dialog.close()
    if (refresh) return refresh()
    return Promise.resolve()
  }

  handleChange = async (name, value) => {
    if (name == 'upload') {
      if (value.size > 104857600) {
        return alerta("Para o melhor funcionamento, arquivos maiores que 100MB não são permitidos", 'erro')
      }
      name = 'data'
      display.setLoading(true)
      const resp = await standaloneUpload(value)
      value = resp.data.url
    }
    this.setState({
      [name]: value,
      // Clean up data if the type of slide changed
      ...(name == 'type' ? { data: '' } : {})
    })
  }

  save = () => {
    const { slide, slideshow } = this.props
    const { upload, ...otherProps } = this.state
    display.setLoading(true)
    if (slideshow) {
      return addSlide(slideshow, upload, _.pickBy(otherProps, v => v !== undefined)).then(() => {
        verificaEspaco()
        this.close()
        display.setLoading(false)

      })
    } else {
      return updateSlide(slide, upload, _.pickBy(otherProps, v => v !== undefined)).then(() => {
        verificaEspaco()
        this.close()
        display.setLoading(false)

      })
    }
  }

  handleQuillChange = (value) => {
    // Atualize o estado quando o conteúdo do Quill mudar
    this.setState({ data: value });
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

  render() {

    const { data, title, description, duration, type = 'photo', upload, fit, backgroundColor } = this.state


    return (
      <Dialog ref={ref => (this.dialog = ref)}>
        <Form>
          <Input
            type={'select'}
            name={'type'}
            label={'Tipo de Slide'}
            value={type}
            choices={[
              { id: 'youtube', label: 'Youtube Video' },
              { id: 'web', label: 'Web Page' },
              { id: 'photo', label: 'Photo' },
              { id: 'video', label: 'Video' },
              { id: 'text', label: 'Texto' },
            ]}
            onChange={this.handleChange}
          />
          {type == 'photo' || upload ? (
            <>
              <Input
                inline={false}
                label={'Foto'}
                type={'text'}
                name={'data'}
                value={data}
                placeholder={"Cole uma URL ou faça novo upload"}
                onChange={this.handleChange}
              />
                <input type='file' accept='image/*' id='upload' hidden onChange={this.abreWindows} />
                <button className='btn btn-outline-primary' onClick={() => { document.getElementById('upload').click() }}>
                  <>
                    <CloudArrowUp width={32} />
                    Fazer novo upload de imagem
                  </>
                </button>
              <Input
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
            </>
          ) : type == 'video' || upload ? (
              <>
                <Input
                  inline={false}
                  label={'Video'}
                  type={'text'}
                  name={'data'}
                  value={data}
                  placeholder={"Cole uma URL ou faça novo upload"}
                  onChange={this.handleChange}
                />
                <input type='file' accept='video/*' id='upload' hidden onChange={this.abreWindows} />
                <button className='btn btn-outline-primary' onClick={() => { document.getElementById('upload').click() }}>
                  <>
                    <CloudArrowUp width={32} />
                    Fazer novo upload de video
                  </>
                </button>

                <Input
                label={'Video fit'}
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
              </>
            )
              : type == "text" ? (
                <div className='h-100'>
                  <CustomEditor data={data} onChange={(value) => this.handleQuillChange(value)} />

                  <div className='w-100 mt-3' >
                    <span>Prévia</span>
                    <div className='announce rounded-3 border' style={{backgroundColor: backgroundColor}}>
                      <div className='text'>

                      {ReactHtmlParser(data)}
                      </div>
                    </div>
                  </div>

                </div>
              )

                : (
                  <Input
                  type={'text'}
                  label={type == 'web' ? 'Web URL' : type == 'youtube' ? 'Youtube URL' : type == 'video' ? 'Video' : 'Data'}
                  name={'data'}
                  value={data}
                  onChange={this.handleChange}
                />
              )}
          {
            type == 'text' && (

              <Input
                type={'color'}
                label={'Cor de fundo'}
                name={'backgroundColor'}
                value={backgroundColor}
                onChange={this.handleChange}
              />
            )
          }
          <Input
            type={'number'}
            label={'Duração'}
            name={'duration'}
            value={duration}
            placeholder={'5'}
            onChange={this.handleChange}
          />
          <Input
            type={'text'}
            label={'Título'}
            name={'title'}
            value={title}
            placeholder={'Titulo do cabeçalho...'}
            onChange={this.handleChange}
          />
          <Input
            type={'textarea'}
            label={'Descrição'}
            name={'description'}
            value={description}
            placeholder={'Breve descrição...'}
            onChange={this.handleChange}
          />
        </Form>
        <ButtonGroup>
          <Button text={'Save'} color={'#9900CC'} onClick={this.save} />
          <Button text={'Cancel'} color={'#e85454'} onClick={this.close} />
        </ButtonGroup>
      </Dialog>
    )
  }
}

export default SlideEditDialog
