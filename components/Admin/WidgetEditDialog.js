import React from 'react'
import Dialog from '../Dialog'
import { Form, Button, ButtonGroup } from '../Form'
import { getWidget, updateWidget } from '../../actions/widgets'
import { display } from '../../stores'

class WidgetEditDialog extends React.Component {
  constructor() {
    super()

    this.state = {}
    this.dialog = React.createRef()
  }

  open = e => {
    if (e) e.stopPropagation()
    this.dialog && this.dialog.current && this.dialog.current.open()
  }

  close = e => {
    if (e) e.stopPropagation()
    return Promise.resolve().then(
      () => this.dialog && this.dialog.current && this.dialog.current.close()
    )
  }

  handleChange = data => {
    this.setState({
      data
    })
  }

  saveData = () => {
    const { id } = this.props
    const { data } = this.state
    display.setLoading(true)
    return updateWidget(id, { data }).then(() => {
      this.close()
      display.setLoading(false)

    })
  }

  componentDidMount() {
    const { id } = this.props
    getWidget(id).then(({ data }) => this.setState({ data }))
  }

  render() {
    const { OptionsComponent = Form } = this.props
    const { data } = this.state
    return (
      <Dialog ref={this.dialog}>
        <OptionsComponent data={data} onChange={this.handleChange} />
        <ButtonGroup style={{ marginTop: 20 }}>
          <Button text={'Save'} color={'#9900CC'} onClick={this.saveData} />
          <Button text={'Cancel'} color={'#e85454'} onClick={this.close} />
        </ButtonGroup>
      </Dialog>
    )
  }
}

export default WidgetEditDialog
