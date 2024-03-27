import Head from 'next/head.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import Display from '../components/Display/Display.js';
import { getDeviceCodigo, getDevices, verificaCodigo } from '../actions/device.js'
import socketIOClient from 'socket.io-client'
import { display } from '../stores/index.js';
import { parseCookies, setCookie } from 'nookies';
import GenericModal from '../components/Util/GenericModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'lodash';



const DisplayPage = ({props, route}) => {
  const [showModal, setShowModal] = useState(false);
  const [displayId, setDisplayId] = useState(null);
  const [device, setDevice] = useState(null);
  const [deviceCod, setDeviceCod] = useState();
  const [host, setHost] = useState();
  const modalRef = useRef();
  const prevDeviceCodigo = useRef(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();



  useEffect(() => {
    const cod = parseCookies(null).deviceCod;
    const host = window.location.host;
    setHost(host)
    if (cod) {
      setDeviceCod(cod);
      getDevicesData(cod); // Chama a função para obter a programação do dispositivo
    } else {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    // Verifique se há um dispositivo e um código válido
    if (device?._id && deviceCod) {

      const socket = socketIOClient(host);
      
      const handleUpdate = () => {
        // Lógica para lidar com a atualização do dispositivo
        throttledRefresh();
      };

      // Adicione o ouvinte do evento do socket
      socket.on(`device:update:${device._id}`, handleUpdate);

      // Certifique-se de remover o ouvinte quando o componente for desmontado
      return () => {
        socket.off(`device:update:${device._id}`, handleUpdate);
      };
    }
  }, [device?._id, deviceCod]);

  const getDevicesData = async (cod = '') => {
    const codigo = parseCookies(null).deviceCod;
    return getDeviceCodigo(codigo).then(res => {
      if (res) {
        setDevice(res.data)
        setShowModal(false);
        const socket = socketIOClient(host);
        socket.on(`device:update:${res._id}`, throttledRefresh);

      }
    })
  }
  const throttledRefresh = useMemo(() => debounce(getDevicesData, 1000), [])


  const save = (data) => {
    verificaCodigo(data).then(res => {
      if (res.data) {
        setCookie(null, 'deviceCod', res.data.codigo)
        window.location.reload()
      }
    })
  }

  const abreModal = () => {
    modalRef.current?.open();
  }

  function SemCodigo() {

    return (
      <div className='d-flex flex-column col-lg-12 p-2 text-center justify-content-center align-items-center'>
        <FontAwesomeIcon icon={faExclamationCircle} className='fs-1' fixedWidth />
        <span className='fs-3'>Seu dispositivo ainda não foi configurado.</span>
        <span>É necessário aceder com o código único, gerado pelo portal administrativo. Caso não obtenha, entre em contato com o seu gestor de conteudo.</span>
        <button className='btn btn-primary mt-5' onClick={abreModal}>
          <span>Aceder código <FontAwesomeIcon icon={faArrowCircleRight} /></span>
        </button>
      </div>
    )
  }

  return (
    <div id='principal' className={'containerGeral'}>
      {showModal && !device && (
        <SemCodigo />
      )}
      { device && (
        /* Renderiza o componente Display quando não está na modal */
        <Display host={host} display={device.display} />
      )}

      <style>
        {`
          .input-codigo {
            text-align: center;
          }
          .containerGeral {
            display: flex;
            width: 100vw;
            height: 100vh;
          }
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          *::-webkit-scrollbar {
            display: none; // Safari and Chrome
          }
        `}
      </style>
      
      <GenericModal ref={modalRef} title='Novo Dispositivo'>
            <div className="d-flex flex-column w-100 p-3">
              <div className="p-4 d-flex flex-column text-center">
                <label className='fs-3'>Informe o código:</label>
                <em className='mb-5'>Não se esqueça de distinguir entre letras maiúsculas e minúsculas!</em>
                <input
                  className={`form-control form-control-lg fs-1 fw-bold fst-italic input-codigo ${errors?.codigo ? 'is-invalid' : ''}`}
                  name="codigo"
                  id="codigo"
                  type="text"
                  maxLength={6}
                  {...register("codigo", { required: true, minLength: 6 })}
                />
                <em className='text-danger' hidden={!errors?.codigo} >Código inválido</em>
              </div>
              <div className="form-button d-flex w-100 justify-content-center mt-3">
                <button className="btn btn-primary" onClick={() => handleSubmit(save)()}>Salvar</button>
              </div>
            </div>
          </GenericModal>
    </div>
  );
};

export default DisplayPage;