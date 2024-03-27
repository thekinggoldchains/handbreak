import { Component } from "react"
import React from 'react'
import { getUsers } from "../../../actions/user"
import styles from './styles.module.scss'

import Dialog from "../../Dialog";
import { Button, ButtonGroup } from "../../Form";
import Display from "../../Display/Display";

class Displays extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [{}, {}, {}],
      isVarejoShowing: false,
      isAtacadoShowing: false,
    }
    this.dialog = React.createRef()
    this.dialogDisplay = React.createRef()

    const colors = ['#214FB0', '#FC7C62', '#4982FC', '#B5FC30', '#81B02A']

  }

  expand = (e) => {
    switch (e) {
      case 1:
        this.setState({
          isVarejoShowing: !this.state.isVarejoShowing
        })
        break;
      case 2:
        this.setState({
          isAtacadoShowing: !this.state.isAtacadoShowing
        })
        break;
      default: 'ué'
        break;
    }
  }

  async getUsers() {
    
    return getUsers().then(users => {
    })
  }

  open = e => {
    if (e) e.stopPropagation()
    this.dialogDisplay && this.dialogDisplay.current.open()
  }
  openDisplay = e => {
    if (e) e.stopPropagation()
    this.dialogDisplay && this.dialogDisplay.current.open()
  }

  close = e => {
    if (e) e.stopPropagation()
    return Promise.resolve().then(
      () => this.dialogDisplay && this.dialogDisplay.current && this.dialogDisplay.current.close()
    )
  }


  render() {
    const { data, show, displayId } = this.props
    console.log("Teste => ", displayId)
    return (
      <div className={styles.preview}>
        <Dialog ref={this.dialogDisplay} >


            <strong>Atenção:</strong><span>Essa prévia não é fiel com reprodução inDoor. Apenas permite que haja uma visualização do conteúdo.</span><br />
            <div className={styles.content}>
              <Display display={displayId} />
            </div>

            <ButtonGroup style={{ marginTop: 20 }}>
              <Button text={'Fechar'} color={'#e85454'} onClick={this.close} />
            </ButtonGroup>

        </Dialog>
      </div>
    )
  }

}

export default Displays