import Head from 'next/head.js'
import React from 'react'
import { view } from 'react-easy-state'

import Frame from '../components/Admin/Frame.js'
import Display from '../components/Display/Display.js'
import { protect } from '../helpers/auth.js'
import { display } from '../stores'

class Preview extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { displayId } = this.props
    display.setId(displayId)
  }

  render() {
    const { host, loggedIn } = this.props
    console.log(host)
    // console.log(window.location.host)
    return (
      <Frame loggedIn={loggedIn}>
        <Head>
          <title>Etag Digital - Prévia</title>
        </Head>
        <h1>Preview</h1>
        <p>Below is a preview of the display as it will appear on the TV.</p>
        <div className='preview'>
          <div id='principal' className='content'>
            <Display host={host} display={this.props.displayId} />
          </div>
        </div>
        <style jsx>
          {`
            h1 {
              font-family: 'Open Sans', sans-serif;
              font-size: 24px;
              color: #4f4f4f;
              margin: 0px;
            }
            p {
              font-family: 'Open Sans', sans-serif;
            }
            .preview {
              margin-top: 20px;
              border-radius: 4px;
              overflow: hidden;
              padding-top: 56.25%;
              position: relative;
            }
            .preview .content {
              position: absolute;
              top: 0;
              width: 100%;
              height: 100%;
            }
          `}
        </style>
      </Frame>
    )
  }
}
export default protect(view(Preview))
