/**
 * @fileoverview Slideshow component that given an array of slide descriptions
 * of mixed types, renders the slides and automatically plays the slideshow for
 * the given durations
 */

import React, { Component } from 'react'
import { config } from '@fortawesome/fontawesome-svg-core'
import { Player, ReplayControl } from 'video-react';
import ReactPlayer from 'react-player';
import Head from 'next/head';


config.autoAddCss = false

const DEFAULT_COLOR = '#0000'
const DEFAULT_URL = 'https://sic.live.impresa.pt/sic540p.m3u8'
const DEFAULT_FIT = 'contain'



class TVContent extends Component {
  constructor(props) {
    super(props)
    this.iframe = React.createRef()
    this.state = {
      ehMudo: true
    }
  }

  componentDidMount() {
    // this.iframe.current?.play();
    this.ajustaVideo();
    // this.ajustaVolume();
    // this.playVideo();
  }

  autoReplay = () => {
  }

  canPlay = (url) => {
    return ReactPlayer.canPlay(url)
  }

  ajustaVideo() {
    setTimeout(() => {
      const { data: { fit = DEFAULT_FIT } = {} } = this.props
      let video = document.querySelector('video');
      video.style.objectFit = fit
    }, 1000);
  }

  ajustaVolume() {
    setTimeout(() => {
      this.setState({ ehMudo: false })
    }, 2000);
  }


  render() {
    const { data: { title, fit = DEFAULT_FIT, url = DEFAULT_URL, color = DEFAULT_COLOR } = {} } = this.props
    return (
      <div className='youtube'>
        {title && (
          <div className='titleConainer'>
            <div className='title'>{title}</div>
          </div>
        )}
        <ReactPlayer ref={this.iframe} muted={this.state.ehMudo} className='react-player' url={url} width='100%' height='100%' playing controls></ReactPlayer>
        {/* <video ref={this.iframe} className='react-player' width='100%' height='100%' controls>
                <source src={url} type="application/x-mpegURL"></source>
            </video> */}
        <style>
          {`
                .youtube-container-nojsx {
                  width: 100%;
                  height: 100%;
                  min-height: 100%;
                }
              `}
        </style>
        <style jsx>
          {`
          .react-player {
            position: absolute;
            top: 0;
            left: 0;
            max-width: 100%;
            max-height: 100%;
          
          }
          video {
          object-fit: ${fit} !important;

          }
            .youtube {
              position: relative;
              box-sizing: border-box;
              height: 100%;
              width: 100%;
              background: ${color};
              flex: 1;
              font-family: 'Open Sans', sans-serif;
              display: flex;
              flex-direction: column;
            }
            .youtube .iframeContainer {
              flex: 1;
              border: none;
              overflow: hidden;
            }
            .youtube .iframe {
              flex: 1;
              border: none;
              width: 100%;
              height: 100%;
            }
            .youtube .titleConainer {
              padding: 12px;
            }
            .youtube .title {
              font-family: 'Open Sans', sans-serif;
              border-left: 3px solid rgba(255, 255, 255, 0.5);
              font-size: 16px;
              padding-left: 12px;
              font-weight: 600;
              text-transform: uppercase;
              z-index: 1;
            }
          `}
        </style>

      </div>
    )
  }
}

export default TVContent
