/**
 * @fileoverview Slideshow component that given an array of slide descriptions
 * of mixed types, renders the slides and automatically plays the slideshow for
 * the given durations
 */

import React, { Component } from 'react'
import { config } from '@fortawesome/fontawesome-svg-core'
import getVideoId from 'get-video-id'
import { Player, ReplayControl } from 'video-react';
import ReactPlayer from 'react-player';
import { display } from '../../../stores';
import Axios from 'axios';


config.autoAddCss = false

const DEFAULT_COLOR = '#0000'
const DEFAULT_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
const DEFAULT_FIT = 'contain'



class YoutubeContent extends Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
    this.state = {
      fit: this.props.fit,
      blob: null
    }
    this.newUrl = null;
  }

  componentDidMount() {
    // this.downloadVideo(this.props.data.url)
    const regex = /[^/]+\/([^/]+)\/([^/]+)/;
    const match = this.props.data.url.match(regex);
    var novaUrl = '';

    if (match) {
      const clienteId = match[1];
      const video = match[2];
      const cloudFrontPrefix = "https://d3h6ziiccg10z4.cloudfront.net/";
      this.props.data.url = cloudFrontPrefix + clienteId + "/" + video;
    }
  }
  async downloadVideo(link) {
    try {
      // const link = await JSON.stringify({link: link})
      const res = await Axios.get('/api/v1/slide/video/', {
        params: {
          link: `${link}`
        }
      });
      console.log(res);

      const uint8Array = new Uint8Array(res.data.data);
      const blob = new Blob([uint8Array], { type: res.headers['content-type'].split(";")[0] });
      const blobURL = URL.createObjectURL(blob);
      this.setState({ blob: blobURL });

    } catch (error) {
      console.error(error);
    }
  }
  autoReplay = () => {
    
  }

  canPlay = (url) => {
    return ReactPlayer.canPlay(url)
  }

  ajustaVideo() {
    const { data: { fit = DEFAULT_FIT } = {} } = this.props
    console.log(fit)
    let video = document.querySelector('video');
    video.style.objectFit = fit
  }


  render() {
    const { data: { title, fit, url = DEFAULT_URL, color = DEFAULT_COLOR } = {} } = this.props
    const { blob } = this.state;
    setTimeout(() => {
      this.ajustaVideo();
    }, 2000);
    return (
      <div className='youtube'>
        {title && (
          <div className='titleConainer'>
            <div className='title'>{title}</div>
          </div>
        )}
        {/* {
          blob && (
            <ReactPlayer className='react-player' style={{ objectFit: fit }} url={blob} loop={true} muted={true} width='100%' height='100%' playing={true} ></ReactPlayer>
          )
        } */}
        <ReactPlayer className='react-player' style={{ objectFit: fit }} url={url} loop={true} muted={true} width='100%' height='100%' playing={true} ></ReactPlayer>

        {/* <video className='react-player' autoPlay={true} src={url} muted={true} loop width='100%' height='100%' preload='auto'/> */}
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
          .react-player video {
            
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

export default YoutubeContent
