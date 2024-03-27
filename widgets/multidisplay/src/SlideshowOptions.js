import React, { Component } from 'react'
import { Form, Input } from '../../../components/Form'
import { getSlideshowsDisplay } from '../../../actions/slideshow'

class SlideshowOptions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideshows: []
    }
  }
  handleChange = (name, value) => {
    const { onChange = () => {} } = this.props
    if (name == 'slideShowId') {
      onChange(value)
    }
  }

  componentDidMount() {
    getSlideshowsDisplay('', 'display').then(data => {
      const slideshows = data.map(slideshow => ({
        id: slideshow._id,
        label: slideshow.title || 'Untitled slideshow'
      }))
      this.setState({ slideshows })
    })
  }

  render() {
    const { data } = this.props
    const { slideshows } = this.state
    return (
      <Form>
        <h3>Widget: Multidisplay</h3>
        <p>Selecione uma playlist</p>
        <Input
          inline={false}
          type={'select'}
          name={'slideShowId'}
          value={data}
          onChange={this.handleChange}
          choices={slideshows}
        />
        <style jsx>
          {`
            h3,
            p {
              font-family: 'Open Sans', sans-serif;
            }
          `}
        </style>
      </Form>
    )
  }
}

export default SlideshowOptions
