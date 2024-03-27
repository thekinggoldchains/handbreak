import React from 'react'
import { view } from 'react-easy-state'

import Frame from '../components/Admin/Frame.js'
import SlideshowList from '../components/Admin/MultiDisplay/SlideshowList'
import Dialog from '../components/Dialog.js'
import { Button } from '../components/Form'

import { addSlideshow } from '../actions/slideshow'
import { protect } from '../helpers/auth.js'

import { display } from '../stores'
import Head from 'next/head.js'

class Slideshows extends React.Component {
  constructor(props) { 
    super(props)
    this.slideshowList = React.createRef()
  }

  add = () => {
    return addSlideshow('', 'display').then(() => {
      this.slideshowList && this.slideshowList.current && this.slideshowList.current.refresh()
    })
  }

  componentDidMount() {
    const { displayId } = this.props
    display.setId(displayId)
  }

  render() {
    const { loggedIn } = this.props
    return (
      <Frame loggedIn={loggedIn}>
        <Head>
          <title>Etag Digital - Multidisplay</title>
        </Head>
        <h1>Playlists multidisplay</h1>
        <div className='wrapper'>
          <SlideshowList ref={this.slideshowList} />
          <Dialog />
          <Button
            text={'+ Adicionar Nova Playlist'}
            color={'#9900CC'}
            onClick={this.add}
            style={{ marginLeft: 0, width: '100%' }}
          />
        </div>
        <style jsx>
          {`
            h1 {
              font-family: 'Open Sans', sans-serif;
              font-size: 24px;
              color: #4f4f4f;
              margin: 0px;
            }
            .wrapper {
              margin: 40px auto;
              max-width: 640px;
            }
          `}
        </style>
      </Frame>
    )
  }
}

export default protect(view(Slideshows))
