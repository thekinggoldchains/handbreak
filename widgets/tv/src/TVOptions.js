import React, { Component } from 'react'
import Lottie from 'react-lottie'
import { getPlaylistTv } from '../../../actions/display'
import { standaloneUpload } from '../../../actions/slide'
import { Button, ButtonGroup, Form, InlineInputGroup, Input } from '../../../components/Form'

class TVOptions extends Component {
  constructor(props) {
    super(props)
    const { title, color, url, fit } = props.data || {}
    this.state = {
      title,
      color,
      url,
      fit,
      loading: false,
      canais: []
    }
  }

  componentDidMount() {
    getPlaylistTv().then(result => {
      const canais = result.items.filter(canal => canal.group.title == 'TV').map(canal => ({
          label: canal.name,
          id: canal.url
      }))
      this.setState({canais: canais})
    })
  }

  handleChange = async (name, value) => {
    const { onChange = () => {} } = this.props
    if (name == 'upload') {
      name = 'url'
      this.setState({loading: true})
      const resp = await standaloneUpload(value)
      this.setState({loading: false})
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
    const { title, color, url, loading, fit, canais } = this.state
    return (
      <div className={'container'}>
        <Form>
          <h3>Widget: Video</h3>
          <Input
              inline={false}
              label={'Emissora'}
              type={'select'}
              name={'url'}
              value={url}
              choices={canais}
              onChange={this.handleChange}
            />
          {loading && (
          <Lottie
            height={50}
            width={50}
            style={{ margin: 0 }}
            options={{
              loop: true,
              autoplay: true,
              animationData: require('../../../components/Form/assets/loading2.json'),
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
              }
            }}
          />
          )}
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

export default TVOptions
