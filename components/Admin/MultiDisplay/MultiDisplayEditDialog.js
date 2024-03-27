import React from 'react'
import _ from 'lodash'

import Dialog from '../../Dialog'
import { Form, Input, Button, ButtonGroup } from '../../Form'

import { getSlide, addSlide, updateSlide } from '../../../actions/slide'
import display, { verificaEspaco } from '../../../stores/display'
import { getDisplays } from '../../../actions/display'

class MultiDisplayEditDialog extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      type: 'display',
      displays: []
    }
  }

  componentDidMount() {
    getDisplays().then(result => {
      const displays = result.map(display => ({
        id: display._id,
        label: display.name
      }))
      this.setState({ displays: displays })
    })
    
    this.refresh()
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
          type: 'display',
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
        type: 'display',
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
    this.dialogMulti && this.dialogMulti.open()
  }

  close = () => {
    const { refresh } = this.props
    this.dialogMulti && this.dialogMulti.close()
    if (refresh) return refresh()
    return Promise.resolve()
  }

  handleChange = (name, value) => {
    console.log(name, value)
    this.setState({
      [name]: value,
      ...(name == 'data' ? { title: this.state.displays.filter(tela => tela.id === value)[0].label } : {})
    })
  }

  save = () => {
    const { slide, slideshow } = this.props
    const { upload, ...otherProps } = this.state
    if (slideshow) {
      return addSlide(slideshow, upload, _.pickBy(otherProps, v => v !== undefined)).then(() => {
        verificaEspaco()
        this.close()
      })
    } else {
      return updateSlide(slide, upload, _.pickBy(otherProps, v => v !== undefined)).then(() => {
        verificaEspaco()
        this.close()
      })
    }
  }

  render() {
    const { data, displays, title, description, duration, type = 'photo', upload, fit } = this.state

    return (
      <Dialog ref={ref => (this.dialogMulti = ref)}>
        <Form>
          <div className='container-fluid'>
            <div className='col-12 row'>
              <div className='col-6 '>
                <Input
                  type={'select'}
                  name={'data'}
                  label={'Display'}
                  value={data}
                  inline={false}
                  choices={displays}
                  onChange={this.handleChange}
                />
              </div>
              <div className='col-4'>
                <Input
                  type={'number'}
                  label={'Duração'}
                  name={'duration'}
                  value={duration}
                  inline={false}
                  placeholder={'5'}
                  onChange={this.handleChange}
                />
              </div>
              <div className='col-6 '>

                <Input
                  type={'text'}
                  label={'Título'}
                  name={'title'}
                  inline={false}
                  value={title}
                  placeholder={'Titulo do cabeçalho...'}
                  onChange={this.handleChange}
                />
              </div>
              <div className='col-12'>
                <Input
                  type={'textarea'}
                  label={'Descrição'}
                  name={'description'}
                  inline={false}
                  value={description}
                  placeholder={'Breve descrição...'}
                  onChange={this.handleChange}
                />
              </div>
            </div>

          </div>
        </Form>
        <ButtonGroup>
          <Button text={'Save'} color={'#9900CC'} onClick={this.save} />
          <Button text={'Cancel'} color={'#e85454'} onClick={this.close} />
        </ButtonGroup>
      </Dialog>
    )
  }
}

export default MultiDisplayEditDialog
