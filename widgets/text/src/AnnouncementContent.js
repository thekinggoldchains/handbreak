/**
 * @fileoverview Slideshow component that given an array of slide descriptions
 * of mixed types, renders the slides and automatically plays the slideshow for
 * the given durations
 */

import React, { Component } from 'react'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AutoScroll from '../../../components/AutoScroll'

import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

config.autoAddCss = false
library.add(fas)
library.add(fab)

const DEFAULT_COLOR = '#708090'
const DEFAULT_TEXT_COLOR = '#ffffff'
const DEFAULT_ACCENT_COLOR = '#EDC951'
const DEFAULT_TEXT = ''
const DEFAULT_TITLE_TEXT_COLOR = '#fff0f0'
const DEFAULT_TEXTSIZE = 18
const DEFAULT_FONT_FAMILY = `'Open-Sans', sans-serif`

class AnnouncementContent extends Component {
  render() {
    const {
      data: {
        text = DEFAULT_TEXT || this.props.text,
        textColor = DEFAULT_TEXT_COLOR,
        titleTextColor = DEFAULT_TITLE_TEXT_COLOR,
        color = DEFAULT_COLOR,
        accentColor = DEFAULT_ACCENT_COLOR,
        textSize = DEFAULT_TEXTSIZE,
        textFont = DEFAULT_FONT_FAMILY
      } = {}
    } = this.props
    return (
      <div className='announce'>

        <AutoScroll style={{ display: 'block' }}>
          <div className='text'>
            {text.split('\n').map(line => (
              <div>{line || <br />}</div>
            ))}
          </div>
        </AutoScroll>
        <style jsx>
          {`
            .announce {
              position: relative;
              box-sizing: border-box;
              height: 100%;
              width: 100%;
              background: ${color};
              color: ${textColor};
              flex: 1;
              padding: 12px;
              font-family: ${textFont};
              display: flex;
              flex-direction: column;
              justify-content: top;
              align-items: center;
            }
            .announce .text {
              font-family: ${textFont};
              font-size: ${textSize}px;
              text-align: center;
              z-index: 1;
              word-break: break-word;
              min-height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              box-sizing: border-box;
            }
          `}
        </style>
      </div>
    )
  }
}

export default AnnouncementContent
