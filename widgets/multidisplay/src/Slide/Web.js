/**
 * @fileoverview Slide component that given a slide type and its data renders it
 * along with its title and description.
 */

import GenericSlide from './Generic'
import Display from '../../../../components/Display/Display.js'

class WebSlide extends GenericSlide {
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
  renderSlideContent(data) {
    return (
      <Display host={"https://localhost:8000"} display={data}/>
      // <div>
      //   Oi
      // </div>
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

export default WebSlide
