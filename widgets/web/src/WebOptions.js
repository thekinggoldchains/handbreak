import React, { Component } from 'react'
import { Form, Input } from '../../../components/Form'

class WebOptions extends Component {
  constructor(props) {
    super(props)
    const { title, color, url } = props.data || {}
    this.state = {
      title,
      color,
      url
    }
  }
  handleChange = (name, value) => {
    const { onChange = () => {} } = this.props
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
    const { title, color, url } = this.state
    return (
      <div className={'container'}>
        <Form>
          <h3>Widget: Web</h3>
          <p>Choose your preferences for the web widget.</p>
          <Input
            inline={false}
            label={'URL da página'}
            type={'text'}
            name={'url'}
            value={url}
            onChange={this.handleChange}
          />
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
            label={'Titulo do Widget'}
            placeholder={'Opções de Titulo...'}
            type={'text'}
            name={'title'}
            value={title}
            onChange={this.handleChange}
          />
        </Form>
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

export default WebOptions
