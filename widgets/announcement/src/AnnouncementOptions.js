import React, { Component } from 'react'
import { Form, Input, InlineInputGroup } from '../../../components/Form'

import AnnouncementContent from './AnnouncementContent'

class AnnouncementOptions extends Component {
  constructor(props) {
    super(props)
    const { text, color, textColor, titleTextColor, accentColor, titleSize, textSize, textFont, titleFont } = props.data || {}
    this.state = {
      text,
      color,
      textColor,
      titleTextColor,
      accentColor,
      titleSize, 
      textSize,
      textFont,
      titleFont
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
    const { text, color, textColor, titleTextColor, accentColor, titleSize, textSize, textFont, titleFont } = this.state
    return (
      <div className={'container'}>
        <Form>
          <h3>Widget: Anúncio</h3>
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
          </InlineInputGroup>
          <InlineInputGroup>
          <Input
              inline={false}
              label={'Tamanho do titulo'}
              type={'number'}
              name={'titleSize'}
              value={titleSize}
              onChange={this.handleChange}
            />
          <Input
              inline={false}
              label={'Tamanho do conteudo'}
              type={'number'}
              name={'textSize'}
              value={textSize}
              onChange={this.handleChange}
            />
          </InlineInputGroup>

          <Input
            inline={false}
            label={'Texto para exibir'}
            placeholder={'Digite o anuncio aqui ...'}
            type={'textarea'}
            name={'text'}
            value={text}
            onChange={this.handleChange}
          />
          <Input
            inline={false}
            label={'Fonte Titulo'}
            type={'font'}
            name={'titleFont'}
            value={titleFont}
            onChange={this.handleChange}
          />
          <Input
            inline={false}
            label={'Fonte Conteudo'}
            type={'font'}
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

export default AnnouncementOptions
