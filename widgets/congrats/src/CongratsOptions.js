import React, { Component } from 'react'
import { Form, Input, InlineInputGroup } from '../../../components/Form'

import CongratsContent from './CongratsContent'

class CongratsOptions extends Component {
  constructor(props) {
    super(props)
    const { animation, text, fontSize, color, textColor, textFont } = props.data || {}
    this.state = {
      animation,
      text,
      color,
      fontSize,
      textColor,
      textFont
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
    const { animation, text, color, fontSize, textColor, textFont } = this.state
    return (
      <div className={'container'}>
        <Form>
          <h3>Widget: Parabéns</h3>
          <p>Escolha suas preferencias para o widget Parabéns.</p>
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
              label={'Cor do Texto'}
              type={'color'}
              name={'textColor'}
              value={textColor}
              onChange={this.handleChange}
            />
            <Input
              inline={false}
              label={'Animation'}
              type={'select'}
              name={'animation'}
              value={animation}
              choices={[
                { id: 'confetti', label: 'Confetti' },
                { id: 'balloons', label: 'Balloons' },
                { id: 'stars', label: 'Stars' },
                { id: 'fireworks', label: 'Fireworks' }
              ]}
              onChange={this.handleChange}
              expand={false}
            />
            <Input
              inline={false}
              label={'Font Size'}
              type={'number'}
              name={'fontSize'}
              value={fontSize}
              onChange={this.handleChange}
              expand={false}
            />
          </InlineInputGroup>

          <Input
            inline={false}
            label={'Text to be displayed'}
            type={'textarea'}
            name={'text'}
            value={text}
            onChange={this.handleChange}
          />
          <Input
            inline={false}
            label={'Fonte'}
            type={'font'}
            name={'textFont'}
            value={textFont}
            onChange={this.handleChange}
          />
        </Form>
        <div className={'previewContainer'}>
          <p>Preview</p>
          <div className={'preview'}>
            <CongratsContent data={this.state} />
          </div>
        </div>
        <style jsx>
          {`
            h3,
            p {
              font-family: 'Open Sans', sans-serif;
            }
            .container {
              display: flex;
              flex-direction: row;
            }
            .preview {
              display: block;
              width: 240px;
              height: 240px;
              border-radius: 6px;
              overflow: hidden;
            }
            .previewContainer {
              margin-left: 16px;
              width: 240px;
            }
          `}
        </style>
      </div>
    )
  }
}

export default CongratsOptions
