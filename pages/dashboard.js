import React from 'react'
import { view } from 'react-easy-state'

import Frame from '../components/Admin/Frame.js'
import DashboardList from '../components/Admin/Dashboard/DashboardList'
import { protect } from '../helpers/auth.js'
import display from '../stores/display.js'

class Users extends React.Component {
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
                    <DashboardList />
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
                    max-width: 100%;
                }
                `}
                </style>
            </Frame>
        )
    }

}

export default protect(view(Users))