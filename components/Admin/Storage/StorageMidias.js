import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef, memo } from 'react'
import Dialog from '../../Dialog'
import { Form, Button, ButtonGroup, Input, InlineInputGroup } from '../../Form'
import styles from './styles.module.scss'
import { getMidiaPorUser } from '../../../actions/slide';
import { alerta } from '../../Toasts';


const StorageMidias = forwardRef((props, ref) => {

    const [form, setForm] = useState({})

    const dialogStorage = useRef(null);
    const [value, setValue] = useState('')

    useImperativeHandle(ref, () => {
        return {
            edit
        }
    })

    useEffect(() => {
        getMidiaPorUser().then(midia => {
            midia.forEach(e => {
                let date = new Date(e.lastModified);
                e.updated = date.toLocaleString('pt-PT',);
            });
            let midiaFilter = null;
            if (props.ehVideos)
                midiaFilter = midia.filter(midias => midias.name.match(/(\.mp4|\.mov|\.wmv|\.mpeg|\.avi)$/i))
            else
                midiaFilter = midia.filter(midias => midias.name.match(/(\.jpg|\.png|\.gif|\.jpeg)$/i))

            return setValue(midiaFilter)
        })
    }, [])

    const edit = (e) => {

        if (e) e.stopPropagation()
        dialogStorage && dialogStorage.current && dialogStorage.current.open()
    }

    const close = e => {
        if (e) e.stopPropagation()

        return Promise.resolve().then(
            () => dialogStorage && dialogStorage.current && dialogStorage.current.close() && limpaState()
        )
    }

    const select = (url) => {
        props.onSelectImageStorage(url)
        close();
        alerta("Já está!")
    }

    return (
        <div className='container' >
            <Dialog ref={dialogStorage}>
                    <div className='col-md-12 flex-wrap d-flex justify-content-center'>
                        {value ? value.map(values => (

                            <div className='card col-md-2 m-2 justify-content-center align-items-center'>
                                {values.type == 'img' ? (
                                    <img src={values.externalLink} className="card-img-top p-4" alt="..." />

                                ) : (
                                    <video className="card-img-top p-4" controls src={values.externalLink} />
                                )}

                                <div className='col-md-12 card-body justify-content-center align-items-center'>
                                    <p className='card-text'>{values.name}</p>
                                    <small>{values.updated}</small>
                                </div>
                                <div className='card-footer col-md-12 align-items-center'>
                                    <button onClick={() => select(values.externalLink)} className='btn btn-primary margin-auto'>Selecionar</button>
                                </div>
                            </div>
                        ) ) : (
                            <h2>Carregando...</h2>
                        )}
                    </div>
                    <ButtonGroup>
                        <Button text='Cancel' onClick={close}></Button>
                    </ButtonGroup>
            </Dialog>
        </div>
    )
    // }
})

export default StorageMidias
