import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { display } from "../../stores";
import Display from "../Display/Display";
import 'react-resizable/css/styles.css'

import styles from './styles.module.scss'
import { ArrowsMove, EyeFill, X, XCircle } from "react-bootstrap-icons";

const FloatWindow = (props) => {
    const [host, setHost] = useState('');
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    console.log(props)
    useEffect(() => {
        setHost(props.host)
        switch (display.scale) {
            case 'vertical':
                setWidth(250)
                setHeight(450)
                break;
            case 'horizontal':
                setWidth(450)
                setHeight(250)
                break
            default:
                setWidth(450)
                setHeight(250)
                break;
        }

    }, [])
    return (
        <Draggable >
            <div className={`${styles['custom-youtube-player']} ${styles[`custom-youtube-player-${display.scale}`]}`}>

                <ResizableBox width={width} height={height} >
                    <div className={styles.content}>
                        <iframe width={'100%'} height={'100%'} src={'https://' + window.location.host + `/display/${display.id}`} />
                    </div>

                    <div className={`${styles.handle} d-flex justify-content-center`}>
                        <ArrowsMove />
                    </div>
                    <div className={`${styles.close} d-flex justify-content-center`} onClick={() => props.hidePreview()}>
                        <X width={25} height={25} />
                    </div>
                </ResizableBox>
            </div>

        </Draggable>
    )
}

export default FloatWindow