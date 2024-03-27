import dynamic from 'next/dynamic.js';
import React, { Component } from 'react'
import { view } from 'react-easy-state'

import Frame from '../components/Admin/Frame.js'


import { protect } from '../helpers/auth.js'
import display from '../stores/display.js'

class Canva extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { displayId } = this.props
        display.setId(displayId)
    }

    render() {
        const Container = dynamic(() => import('../components/Admin/Canva/Container'), {
            ssr: false,
        });
        const { loggedIn } = this.props
        return (
            <>
                <div className='wrapper'>
                    <Container />
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
                    box-sizing: border-box;
                }
                `}
                </style>
            </>
        )
    }

}

export default protect(view(Canva))