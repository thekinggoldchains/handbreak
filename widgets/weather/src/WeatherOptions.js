import React, { Component } from 'react'
import { Form, Input } from '../../../components/Form'

class WeatherOptions extends Component {
  constructor(props) {
    super(props)
    const { city, unit } = props.data || {}
    this.state = {
      city,
      unit
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
    const { city, unit } = this.state
    return (
      <Form>
        <h3>Widget: Weather</h3>
        <p>Escolha suas preferencia para o widget</p>
        <Input
          inline={false}
          label={'Cidade'}
          type={'text'}
          name={'city'}
          value={city}
          onChange={this.handleChange}
        />
        <Input
          inline={false}
          label={'Unidade de Temperatura'}
          type={'select'}
          name={'unit'}
          value={unit}
          choices={[{ id: 'imperial', label: 'Fahrenheit' }, { id: 'metric', label: 'Celsius' }]}
          onChange={this.handleChange}
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

export default WeatherOptions
