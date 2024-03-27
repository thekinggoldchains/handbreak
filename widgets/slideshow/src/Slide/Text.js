/**
 * @fileoverview Slide component that given a slide type and its data renders it
 * along with its title and description.
 */

import GenericSlide from './Generic'
import React from 'react'
import ReactHtmlParser from 'react-html-parser';
import AutoScroll from '../../../../components/AutoScroll';

class TextSlide extends GenericSlide {
  constructor(props) {
    super(props)

  }

  componentDidMount() {
    this.state.loading.resolve()

  }

  /**
   * Renders the inner content of the slide (ex. the photo, youtube iframe, etc)
   * @param {string} data The slide's data (usually a URL or object ID)
   * @returns {Component}
   */
  renderSlideContent(data, slideType, slide) {
    return (
        <div className='announce'>
          <AutoScroll style={{ display: 'block' }}>
            <div className='text'>
              {ReactHtmlParser(data)}

            </div>
          </AutoScroll>
        <style jsx>{`
                    .announce {
                      position: relative;
                      box-sizing: border-box;
                      height: 100%;
                      width: 100%;
                      flex: 1;
                      padding: 12px;
                      display: flex;
                      flex-direction: column;
                      justify-content: top;
                      align-items: center;
                      background-color: ${slide.backgroundColor}
                    }
                    .announce .text {
                      text-align: center;
                      z-index: 1;
                      word-break: break-word;
                      min-height: 100%;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      box-sizing: border-box;
                    }
        `}</style>
      </div>
    )
  }

  /**
   * Stops the slide's content from playing when the slide is out of focus
   */
  stop = () => {}

  /**
   * Starts or resumes the slide's content when the slide is in focus
   */
  play = () => {}
}

export default TextSlide
