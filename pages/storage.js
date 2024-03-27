import React from 'react'
import { view } from 'react-easy-state'

import Frame from '../components/Admin/Frame.js'
import { protect } from '../helpers/auth.js'
import display from '../stores/display.js'
import ListaMidia from '../components/Admin/Storage/ListaMidias.js'

class Storage extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { displayId } = this.props
        display.setId(displayId)
      }

    render() {
        const { loggedIn } = this.props
        return (

            <Frame loggedIn={loggedIn} >
                <div className='wrapper'>
                    <ListaMidia />
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
                    max-width: 100%;
                }
                @media (min-width: 992px) {
                    .container {
                        width: 970px;
                     }
                }
                `}
                </style>
            </Frame>
        )
    }

}

export default protect(view(Storage))