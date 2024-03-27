/**
 * @fileoverview Shows the display frame and renders all the
 * widgets inside of it
 */

import React from 'react'
import GridLayout from 'react-grid-layout'
import socketIOClient from 'socket.io-client'
import _ from 'lodash'
import { view } from 'react-easy-state'

import Frame from './Frame.js'
import HeightProvider from '../Widgets/HeightProvider'
import Widgets from '../../widgets'
import EmptyWidget from '../Widgets/EmptyWidget'

import { getDisplay } from '../../actions/display'
import display from '../../stores/display.js'
import Head from 'next/head.js'

const DEFAULT_STATUS_BAR = []
const DEFAULT_LAYOUT = 'spaced'
const DEFAULT_SCALE = 'horizontal'

class Display extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      widgets: [],
      layout: DEFAULT_LAYOUT,
      statusBar: DEFAULT_STATUS_BAR,
      scale: DEFAULT_SCALE,
      io: null
    }
    this.throttledRefresh = _.debounce(this.refresh, 1500)
  }

  componentDidMount() {
    display.verificaEspaco()
    this.refresh();
    const { host = 'https://localhost' } = this.props
    const socket = socketIOClient(host)
    this.setState({ io: socket })
    socket.on(`admin:update:${this.props.display}`, this.throttledRefresh)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.display != this.props.display) {
      this.refresh()
    }
    display.verificaEspaco();
    // this.vertical();

  }

  componentWillUnmount() {
    this.state.io.close()
  }

  refresh = () => {
    const { display } = this.props
    if (display) {
      return getDisplay(display).then(({ widgets = [], layout, statusBar = DEFAULT_STATUS_BAR, scale }) => {
        this.setState({ widgets, layout, statusBar, scale })
        if (this.state.scale != scale) this.vertical(scale)
      })
    }
  }

  vertical = (scale) => {
    const principalHeight = document.getElementById('principal')?.offsetHeight
    const principalWidth = document.getElementById('principal')?.offsetWidth
    if (scale == 'vertical' && (principalHeight && principalWidth)) {
      document.getElementById('principal').style.height = principalWidth + 'px'
      document.getElementById('principal').style.width = principalHeight + 'px'
      document.getElementById('principal').style.transform = 'translate(-50%,-50%) rotate(270deg)'
      document.getElementById('principal').style.position = 'absolute'
      document.getElementById('principal').style.left = '50%';
      document.getElementById('principal').style.top = '50%';
    }
    else {
      document.getElementById('principal')?.removeAttribute('style')
    }
  }

  render() {
    const { widgets, layout, statusBar } = this.state
    const widgetLayout = widgets.map(widget => ({
      i: widget._id,
      x: widget.x || 0,
      y: widget.y || 0,
      w: widget.w || 1,
      h: widget.h || 1
    }))

    const GridLayoutWithHeight = HeightProvider(GridLayout, this.container, layout)

    return (
      <Frame statusBar={statusBar}>
        <Head>
          <title>Etag Digital - {layout.name || "Display"}</title>
        </Head>
        <div className={'gridContainer'} ref={ref => (this.container = ref)}>
          <GridLayoutWithHeight
            className='layout'
            isDraggable={false}
            isResizable={false}
            layout={widgetLayout}
            cols={6}
            margin={layout == 'spaced' ? [10, 10] : [0, 0]}
          >
            {widgets.map(widget => {
              const type = widget.type
              let Widget = Widgets[widget.type] && Widgets[widget.type].Widget || EmptyWidget;
              return (
                <div key={widget._id} className={'widget'}>
                  <Widget data={widget.data} />
                </div>
              )
            })}
          </GridLayoutWithHeight>
          <style jsx>
            {`
              .gridContainer {
                flex: 1;
                overflow: hidden;
                margin-bottom: ${layout == 'spaced' ? 10 : 0}px;
              }
              .widget {
                border-radius: ${layout == 'spaced' ? 6 : 0}px;
                overflow: hidden;
              }
            `}
          </style>
        </div>
      </Frame>
    )
  }
}

export default view(Display)
