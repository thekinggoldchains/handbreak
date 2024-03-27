import React, { Component } from 'react'
import { Form, Input, InlineInputGroup } from '../../../components/Form'

import AnnouncementContent from './AnnouncementContent'

class AnnouncementOptions extends Component {
  constructor(props) {
    super(props)
    const { text, color, textColor, titleTextColor, accentColor, textSize, textFont } = props.data || {}
    this.state = {
      text,
      textSize,
      color,
      textColor,
      titleTextColor,
      accentColor,
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
    const { text, color, textColor, titleTextColor, accentColor, textSize, textFont } = this.state
    return (
      <div className={'container'}>
        <Form>
          <h3>Widget: Texto Genérico</h3>
          <p>Escolha suas preferencias para o widget de Atenção.</p>
          <InlineInputGroup>
            <Input
              inline={false}
              label={'Cor de fundo'}
              type={'color'}
              name={'color'}
              value={color}
              onChange={this.handleChange}
            />
            <Input
              inline={false}
              label={'Cor de texto'}
              type={'color'}
              name={'textColor'}
              value={textColor}
              onChange={this.handleChange}
            />
            <Input
              inline={false}
              label={'Cor do titulo'}
              type={'color'}
              name={'titleTextColor'}
              value={titleTextColor}
              onChange={this.handleChange}
            />
            <Input
              inline={false}
              label={'Cor de destaque'}
              type={'color'}
              name={'accentColor'}
              value={accentColor}
              onChange={this.handleChange}
            />
            <Input
            inline={false}
            label={'Tamanho do Texto'}
            type={'number'}
            name={'textSize'}
            value={textSize}
            onChange={this.handleChange}
          />
          </InlineInputGroup>

          <Input
            inline={false}
            label={'Texto para exibir'}
            placeholder={'Enter an announcement here ...'}
            type={'textarea'}
            name={'text'}
            value={text}
            onChange={this.handleChange}
          />
          <Input
            inline={false}
            label={'Fonte'}
            type={'select'}
            choices={[
              { id: `'Open-Sans', sans-serif`, label: 'Open-Sans' },
              { id: `'Inconsolata', monospace`, label: 'Inconsolata' },
              { id: `'Lobster', cursive`, label: 'Lobster' },
              { id: `'Nunito', sans-serif`, label: 'Nunito' },
              { id: `'Roboto', sans-serif`, label: 'Roboto' },
              { id: `'Silkscreen', cursive`, label: 'Silkscreen' },
              { id: `'Rubik Dirt', cursive`, label: 'Efeito Giz' },
            ]}
            name={'textFont'}
            value={textFont}
            onChange={this.handleChange}
          />
        </Form>
        <div className={'previewContainer'}>
          <p>Preview</p>
          <div className={'preview'}>
            <AnnouncementContent data={this.state} />
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
              width: 100%;
              height: 240px;
              border-radius: 6px;
              overflow: hidden;
            }
            .previewContainer {
              width: auto;
            }
          `}
        </style>
      </div>
    )
  }
}

export default AnnouncementOptions
