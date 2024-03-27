import ReactPlayer from "react-player";


/**
 * @fileoverview Slide component that given a slide type and its data renders it
 * along with its title and description.
 */

import GenericSlide from './Generic'
import getVideoId from 'get-video-id'
import YouTube from 'react-youtube'
import React from "react";

class YoutubeSlide extends GenericSlide {
    constructor(props) {
        super(props)
        this.myRef = React.createRef();
    }

    handleYoutubeLoaded = () => {
        this.state.loading.resolve
            ? this.state.loading.resolve()
            : this.setState({ loading: { promise: Promise.resolve() } })
    }

    onYoutubeReady = event => {
        // access to player in all event handlers via event.target
        this.handleYoutubeLoaded()

    }
    handlePause = () => {
        this.setState({ playing: false })
    }

    handlePlay = () => {
        this.setState({ playing: true })
    }


    /**
     * Renders the inner content of the slide (ex. the photo, youtube iframe, etc)
     * @param {string} data The slide's data (usually a URL or object ID)
     * @returns {Component}
     */
    renderSlideContent(data, type, slide) {
        return (
            <div className={'youtube-container'}>

                {/* <ReactPlayer ref={this.myRef} className='youtube-container-nojsx' url={data} loop={true} muted={true} width='100%' height='100%' playing={this.play} stopOnUnmount={true}></ReactPlayer> */}
                <video className='youtube-container-nojsx'
                    style={{ objectFit: `${slide.fit}` }}
                    src={data}
                    autoPlay={true}
                    id='videoPlayer'
                    muted={true}
                    loop
                    width='100%'
                    ref={this.myRef}
                    height='100%'
                    preload='auto' />

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
             .youtube-container {
               width: 100%;
               height: 100%;
               min-height: 100%;
             }
           `}
                </style>
            </div>
        )
    }

    /**
     * Stops the slide's content from playing when the slide is out of focus
     */
    stop = () => {
        this.handlePause()
        if (this.myRef.current) {
            this.myRef.current.currentTime = 0;
            this.myRef.current.pause();
          }
    }

    /**
     * Starts or resumes the slide's content when the slide is in focus
     */
    play = () => {
        this.handlePlay()
        if (this.myRef.current) {
            this.myRef.current.currentTime = 0;
            this.myRef.current.play();
          }
    }
}

export default YoutubeSlide


