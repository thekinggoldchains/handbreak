import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DataTable from "react-data-table-component"
import React, { useState, useEffect, useRef, useMemo } from "react"
import { debounce } from 'lodash'; // Importe a biblioteca lodash
import socketIOClient from 'socket.io-client'
import { faEdit, faPlus, faSync, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { display } from "../../../stores"
import Router from 'next/router'
import GenericModal from "../../Util/GenericModal";
import ConfirmModal from "../../Util/ConfirmModal";
import DeviceCreate from "../Device/DeviceCreate"
import { deleteDevice, getDevices, updateDevice, updateDevices } from "../../../actions/device"



const ListaDispositivo = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const [sockets, setSockets] = useState({});
  const [onlineStatus, setOnlineStatus] = useState({});
  const [deviceId, setDeviceId] = useState(null);
  const modalRef = useRef();
  const modalConfirmRef = useRef();
  const modalTrocaRef = useRef();
  const [toggleCleared, setToggleCleared] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [showBtn, setShowBtn] = useState(false)
  
  
  
  
  const getDevicesData = async () => {
    return getDevices().then(res => {
      if (res) {
        setDispositivos(res);
      }
    })
  }
  const throttledRefresh = useMemo(() => debounce(() => {getDevicesData();}, 1500), [])
  
  useEffect(() => {
    const host = 'https://' + window.location.host

    getDevices().then(res => {
      if (res) {
        setDispositivos(res);
        const newSockets = {};

        res.forEach(device => {
          
          const socket = socketIOClient(host);
          socket.on(`device:update:${device._id}`, throttledRefresh);

          newSockets[device._id] = socket;
        });

        setSockets(newSockets);
      }
    });

    // Limpeza: desconecte os sockets quando o componente é desmontado
    return () => {
      Object.values(sockets).forEach(socket => {
        socket.disconnect();
      });
    };
  }, []);

  const checkOnlineStatus = async () => {
    debugger;
    let newData = dispositivos.map(device => {
      socket.on(`device:online:${device._id}`, (arg, res) => {
        console.log("dentro do socket => ", arg, res)

      });
      const isOnline = socket?.connected;

      const updatedDevice = { ...device }; // Criando uma cópia do dispositivo
      updatedDevice.status = device.status === 'Inativo' ? 'Inativo' : isOnline ? 'Online' : 'Offline';
      return updatedDevice;
    });

    if (newData.length > 0){
      
      setDispositivos(newData);
    }
  };

  const openModal = (id) => {
    if (id) setDeviceId(id);
    modalRef.current?.open();

  }
  const openModalConfirm = (id) => {
    modalConfirmRef.current?.setarData(id)
    modalConfirmRef.current?.open();
  }
  const getData = () => {
    modalRef.current?.close();
    setDeviceId(null);
    getDevices().then(res => {
      if (res) {
        setDispositivos(res)
      }
    })
  }

  // const job = setInterval(checkOnlineStatus, 10000); // Verificar a cada 5 minutos


  const onDelete = () => {
    deleteDevice(modalConfirmRef.current.getData()).then(res => {
      getData();
      modalRef.current?.close();

    })
  }

  const updateVarios = (displaySelecionado) => {
    console.log("varios")
    for (let index = 0; index < selectedRows.length; index++) {
      selectedRows[index].display = displaySelecionado.display;
    }
    updateDevices(selectedRows).then(res => {
      setSelectedRows([]);
      getData();
      modalTrocaRef.current?.close();
    })
  }

  const columnsTelas = [
    {
      name: "Ações",
      grow: 0.2,
      cell: (row) => (
        <div className="d-flex justify-content-between">
          <button className='btn btn-danger me-2' data-bs-toggle="tooltip" data-bs-placement="top" title="Apagar" onClick={() => openModalConfirm(row._id)}>
            <FontAwesomeIcon
              icon={faTrashAlt}
            />
          </button>
          <button className='btn btn-secondary' data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" onClick={() => openModal(row._id)}>
            <FontAwesomeIcon
              icon={faEdit}
            />
          </button>
        </div>
      )
    },
    {
      name: "Nome",
      grow: 0.2,
      selector: row => row.nome,
      sortable: true
    },
    {
      name: "Cod. Device",
      grow: 0.2,
      selector: row => row.codigo,
      sortable: true
    },
    {
      name: "Apresentação Ativa",
      grow: 0.2,
      selector: row => row.display?.name,
      sortable: true
    },
    {
      name: "Status",
      grow: 0.2,
      // selector: row => row.status,
      cell: (row) => (
        <div className="d-flex align-items-center">
          <div
            className={`rounded-circle me-2 ${row.status == "Inativo" ? 'bg-secondary' : row.status == "Offline" ? 'bg-danger' : 'bg-success'}`}
            style={{ width: 15, height: 15 }}>
          </div>
          <span> {row.status}</span>
          <div>
            <button className="btn btn-sm btn-primary ms-2 "><FontAwesomeIcon icon={faSync} />
            </button>
          </div>
        </div>
      ),
      sortable: true
    },
  ]


  const styleTableTelas = {
    table: {
      style: {
        margin: '25px 0',
        maxHeight: '45vh',
        overflow: 'auto',
      }
    },
    rows: {
      style: {
        minHeight: '72px',
        textAlign: 'center'  // substituir a altura da linha 
      }
    },
    headCells: {
      style: {
        backgroundColor: '#9900CC',
        color: '#ffffff',
        width: '100%',
        justifyContent: 'center',
        fontSize: 18,
        textAlign: 'center',
      }
    },
    cells: {
      style: {
        padding: ('12px 15px'),
        fontSize: 16,
        textAlign: 'center',
        justifyContent: 'center',

      },
    },
  }

  const paginationOptions = {
    rowsPerPageText: 'Resultados por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  const handleRowSelected = React.useCallback(state => {
    setSelectedRows(state.selectedRows);
    console.log(state, "AAAA")
    setShowBtn(true)
  }, []);

  return (

    <div className='col-xl-12 mb-4'>
      <div className='card'>
        <div className='card-header col-md-12 d-flex flex-row justify-content-between'>
          <span className='fs-5 fw-bold'>Dispositivos ({dispositivos ? dispositivos.length : 0})</span>
          <div className="col-md-4 d-flex botao justify-content-end">
            {
              selectedRows.length > 0 && (
                <button className="btn btn-primary justify-content-arround me-2" onClick={() => modalTrocaRef.current?.open()}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  <span className="botao flex-4">Alterar Apresentação</span>
                </button>
              )
            }
            <button className="btn btn-primary justify-content-around" onClick={() => openModal()}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              <span className="botao flex-4">Novo Dispositivo</span>
            </button>
          </div>
        </div>
        <div className='card-body'>
          <DataTable
            columns={columnsTelas}
            data={dispositivos}
            customStyles={styleTableTelas}
            pagination
            fixedHeader
            paginationComponentOptions={paginationOptions}
            selectableRows
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
          />
        </div>
      </div>

      <style jsx>
        {
          `
            .botao {
              font-size: 16px !important;
            }
          `
        }
      </style>
      <GenericModal ref={modalRef} title='Novo Dispositivo'>
        <DeviceCreate refresh={getData} id={deviceId} />
      </GenericModal>

      <GenericModal ref={modalTrocaRef} title='Escolha a Apresentação'>
        <DeviceCreate refresh={getData} id={deviceId} ehTroca={true} onConfirm={(data) => updateVarios(data)} />
      </GenericModal>

      <ConfirmModal ref={modalConfirmRef} onConfirm={() => onDelete()}>
        <div className="d-flex flex-column h-100">
          <span className="mb-2">Deseja remover o dispositivo ?</span>
          <strong>Isso será irreversível</strong>
        </div>
      </ConfirmModal>
    </div>
  )
}

export default ListaDispositivo