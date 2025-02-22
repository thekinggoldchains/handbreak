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
const DEFAULT_TEXT_FONT = `'Open-sans' sans-serif`
const DEFAULT_TITLE_FONT = `'Open-sans' sans-serif`
const DEFAULT_ACCENT_COLOR = '#EDC951'
const DEFAULT_TEXT = ''
const DEFAULT_TITLE_TEXT_COLOR = '#fff0f0'
const DEFAULT_TEXT_SIZE = 16
const DEFAULT_TITLE_SIZE = 18

class AnnouncementContent extends Component {
  render() {
    const {
      data: {
        text = DEFAULT_TEXT,
        textFont = DEFAULT_TEXT_FONT,
        titleFont = DEFAULT_TITLE_FONT,
        textSize = DEFAULT_TEXT_SIZE,
        textColor = DEFAULT_TEXT_COLOR,
        titleTextColor = DEFAULT_TITLE_TEXT_COLOR,
        titleSize = DEFAULT_TITLE_SIZE,
        color = DEFAULT_COLOR,
        accentColor = DEFAULT_ACCENT_COLOR
      } = {}
    } = this.props
    return (
      <div className='announce'>
        <div className='title'>
          <div className='icon'>
            <FontAwesomeIcon icon={'exclamation-triangle'} size={'0.4x'} color={accentColor} />
          </div>
          <span>Aviso</span>
        </div>
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
            .announce .icon {
              margin-right: 8px;
              margin-left: 8px;
            }
            .announce .title {
              color: ${titleTextColor};
              font-family: ${titleFont};
              font-size: ${titleSize}px;
              text-align: left;
              padding: 4px;
              z-index: 1;
              border-left: 4px solid ${accentColor};
              display: flex;
              flex-direction: row;
              align-items: center;
              width: 100%;
            }
          `}
        </style>
      </div>
    )
  }
}

export default AnnouncementContent
