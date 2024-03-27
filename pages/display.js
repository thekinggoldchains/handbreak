/**
 * @fileoverview Preview page (shows the display frame and renders all the
 * widgets inside of it)
 */

import Head from 'next/head.js'
import React from 'react'
import { view } from 'react-easy-state'

import Display from '../components/Display/Display.js'
import { display } from '../stores'

class DisplayPage extends React.Component {
  constructor(props) {
    super(props)
  }

  static async getInitialProps({ query, req }) {
    const displayId = query && query.display
    const host =
      req && req.headers && req.headers.host ? 'https://' + req.headers.host : window.location.origin

    return { host, displayId }
  }

  componentDidMount() {
    const { displayId } = this.props
    display.setId(displayId)
    // this.vertical();
  }

  componentDidUpdate() {
    // this.vertical();
  }

  async vertical() {
    if (display.scale == 'vertical') {
      const principalHeight = document.getElementById('principal').offsetHeight
      const principalWidth = document.getElementById('principal').offsetWidth
      document.getElementById('principal').style.height = principalWidth + 'px'
      document.getElementById('principal').style.width = principalHeight + 'px'
      document.getElementById('principal').style.transform = 'translate(-50%,-50%) rotate(270deg)'
      document.getElementById('principal').style.position = 'absolute'
      document.getElementById('principal').style.left = '50%';
      document.getElementById('principal').style.top = '50%';
    }
  }

  render() {
    const { host } = this.props
    return (
      <div id='principal' className={'containerGeral'}>
        <Display host={host} display={this.props.displayId} />
        <style jsx>
          {`

          `}
        </style>
        <style>
          {`
            .containerGeral {
              display: flex;
              width: 100vw;
              height: 100vh;
            }
            * {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            *::-webkit-scrollbar {
                display: none;  // Safari and Chrome
            }
          `}
        </style>
      </div>
    )
  }
}

export default view(DisplayPage)
