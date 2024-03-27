import React, { Component } from 'react'
import { Form, Input, InlineInputGroup, Button } from '../../../components/Form'

import ListContent from './ListContent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

class ListOptions extends Component {
  constructor(props) {
    super(props)
    const { title, color, textColor, fontSize, fontText, fontLabel, list = [] } = props.data || {}
    this.state = {
      title,
      color,
      textColor,
      list,
      fontSize,
      fontText,
      fontLabel
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

  elementTextChange = (index, value) => {
    const { onChange = () => {} } = this.props
    this.state.list[index].text = value
    this.setState(
      {
        list: this.state.list
      },
      () => {
        onChange(this.state)
      }
    )
  }

  elementLabelChange = (index, value) => {
    const { onChange = () => {} } = this.props
    this.state.list[index].label = value
    this.setState(
      {
        list: this.state.list
      },
      () => {
        onChange(this.state)
      }
    )
  }

  elementSizeLabelText = (index, value) => {
    const { onChange = () => {} } = this.props
    this.state.list[index].fontLabel = value
    this.setState(
      {
        list: this.state.list
      },
      () => {
        onChange(this.state)
      }
    )
  }
  elementSizeText = (index, value) => {
    const { onChange = () => {} } = this.props
    this.state.list[index].fontText = value
    this.setState(
      {
        list: this.state.list
      },
      () => {
        onChange(this.state)
      }
    )
  }

  addEntry = () => {
    this.setState({
      list: [...this.state.list, { text: '', label: null, fontLabel: 12, fontText: 16 }]
    })

    return Promise.resolve()
  }
  deleteEntry = index => {
    const { onChange = () => {} } = this.props
    this.setState(
      {
        list: this.state.list.filter((el, i) => i != index)
      },
      () => {
        onChange(this.state)
      }
    )
    return Promise.resolve()
  }

  render() {
    const { title, color, textColor, list = [], fontSize, fontText, fontLabel } = this.state
    return (
      <div className={'containerList'}>
        <Form>
          <h3>Widget: List</h3>
          <p>Choose your preferences for the list widget.</p>
          <InlineInputGroup>
            <Input
              inline={false}
              label={'Titulo do Widget'}
              type={'text'}
              name={'title'}
              value={title}
              placeholder={'Opções de Titulo...'}
              onChange={this.handleChange}
            />
            <Input
              inline={false}
              label={'Tamanho da fonte do titulo'}
              type={'number'}
              name={'fontSize'}
              value={fontSize}
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
              label={'Cor do Texto'}
              type={'color'}
              name={'textColor'}
              value={textColor}
              onChange={this.handleChange}
            />
          </InlineInputGroup>
          <hr className='separator' />
          <span className='subheader'>Element List</span>
          <div className='list'>
            {list.map(({ fontLabel, fontText, label, text }, index) => (
              <InlineInputGroup>
                <Input
                  inline={false}
                  name={index}
                  value={text}
                  onChange={this.elementTextChange}
                  placeholder={'Write some text...'}
                  expand
                />
                <Input
                  inline={false}
                  name={index}
                  value={fontText}
                  onChange={this.elementSizeText}
                  placeholder={'Tamanho'}
                  type={'number'}
                />
                <Input
                  inline={false}
                  name={index}
                  value={label}
                  onChange={this.elementLabelChange}
                  placeholder={'Label...'}
                  expand={false}
                />
                <Input
                  inline={false}
                  name={index}
                  value={fontLabel}
                  onChange={this.elementSizeLabelText}
                  placeholder={'Tamanho'}
                  type={'number'}
                />
                <div className={'deleteBtn'}>
                  <FontAwesomeIcon
                    icon={faTrash}
                    fixedWidth
                    color='#828282'
                    onClick={() => this.deleteEntry(index)}
                  />
                </div>
              </InlineInputGroup>
            ))}
          </div>
          <Button
            text={' + Add Entry'}
            color={'#9900CC'}
            onClick={this.addEntry}
            style={{ margin: 0 }}
          />
        </Form>
        <div className={'previewContainer'}>
          <p>Preview</p>
          <div className={'preview'}>
            <ListContent data={this.state} />
          </div>
        </div>
        <style jsx>
          {`
            h3,
            p {
              font-family: 'Open Sans', sans-serif;
            }
            .containerList {
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
            .deleteBtn {
              padding: 8px;
              display: flex;
              flex-direction: column;
              min-height: 40px;
              justify-content: center;
              align-items: center;
            }
            .separator {
              border: none;
              border-bottom: 1px solid #ededed;
              width: 100%;
            }
            .subheader {
              margin-right: 16px;
              color: #666666;
              font-family: 'Open Sans', sans-serif;
              font-weight: 600;
              display: inline-block;
              padding-top: 16px;
              padding-bottom: 16px;
            }
          `}
        </style>
      </div>
    )
  }
}

export default ListOptions
