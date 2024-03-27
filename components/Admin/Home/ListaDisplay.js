import { faEdit } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DataTable from "react-data-table-component"
import { getDisplays, cloneDisplay, deleteDisplay, addDisplay } from "../../../actions/display"
import React, { useState, useEffect, createRef, useRef } from "react"
import { faClone, faEye, faPlay, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { display } from "../../../stores"
import Router from 'next/router'
import ConfirmModal from "../../Util/ConfirmModal";
import Dialog from "../../Dialog"


const ListaDisplay = () => {
  const [data, setData] = useState([]);
  const modalRef = useRef()

  useEffect(() => {
    getDisplays().then(res => {
      if (res) {
        setData(res)
        display.setId(res[0]._id)
      }
    })
  }, [])


  const columnsTelas = [
    {
      name: "Ações",
      grow: 0.4,
      cell: (row) => (

        <div className="d-flex">
          <button disabled={data.length == 1} className='btn btn-danger me-2' data-bs-toggle="tooltip" data-bs-placement="top" title="Apagar" onClick={(e) => confirm(row._id)}>
            <FontAwesomeIcon
              icon={faTrashAlt}
            />
          </button>
          <button className='btn btn-warning white me-2' data-bs-toggle="tooltip" data-bs-placement="top" title="Duplicar" onClick={(e) => clone(row._id)}>
            <FontAwesomeIcon
              icon={faClone}
            />
          </button>
          <button className='btn btn-secondary me-2' data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" onClick={(e) => editDisplay(e, row)}>
            <FontAwesomeIcon
              icon={faEdit}
            />
          </button>
          <button className='btn btn-primary me-2' data-bs-toggle="tooltip" data-bs-placement="top" title="Prévia" onClick={(e) => openDisplay(e, row)}>
            <FontAwesomeIcon
              icon={faEye}
            />
          </button>

        </div>

      )
    },
    {
      name: "Nome",
      grow: 0.6,
      selector: row => row.name,
      sortable: true,
    },
  ]

  const openDisplay = (event, row) => {
    window.open('/display/' + row._id, '_blank')

  }
  const editDisplay = (event, row) => {
    Router.push('/layout?display=' + row._id)

  }

  const clone = (displayId) => {
    display.setLoading(true)

    return cloneDisplay(displayId).then(res => {
      getDisplays().then(res => {
        if (res) {
          setData(res)
          display.displays = res
        }
      })
      display.setLoading(false)
    })
  }
  const onCreate = () => {
    display.setLoading(true)

    return addDisplay().then(res => {
      getDisplays().then(res => {
        if (res) {
          setData(res)
          display.displays = res
        }
      })
      display.setLoading(false)
    }).catch(err => {
      console.log(err.error)
        alerta(err);
    })
  }


  const onDelete = (displayId) => {
    display.setLoading(true)

    return deleteDisplay(displayId).then(res => {
      getDisplays().then(res => {
        if (res) {
          setData(res)
          display.displays = res
        }
      })
      display.setLoading(false)
    })
  }

  const confirm = (displayId) => {
    modalRef.current?.setarData(displayId);
    modalRef.current?.open();
  }

  const styleTableTelas = {
    table: {
      style: {
        margin: '25px 0',
        maxHeight: '45vh',
        overflow: 'auto'
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
      }
    },
    cells: {
      style: {
        padding: ('12px 15px'),
        fontSize: 16,
        textAlign: 'center',
        justifyContent: 'center'
      },
    },
  }

  const paginationOptions = {
    rowsPerPageText: 'Resultados por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };


  return (

    <div className='col-xl-6 mb-4'>
      <div className='card'>
        <div className='card-header col-md-12 d-flex flex-row justify-content-between '>
          <span className='fs-5 fw-bold'>Minhas Apresentações ({data ? data.length : 0})</span>
          <div className="col-md-6 botao d-flex justify-content-end">
            <button className="btn btn-primary justify-content-around"  onClick={() => onCreate()}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              <span className="botao flex-4">Nova Apresentação</span>
            </button>
          </div>
        </div>
        <div className='card-body'>
          <DataTable
            columns={columnsTelas}
            data={data}
            customStyles={styleTableTelas}
            pagination
            fixedHeader
            paginationComponentOptions={paginationOptions}
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

      <ConfirmModal ref={modalRef} onConfirm={() => onDelete(modalRef.current?.getData())}>
        <span>Deseja realmente apagar a apresentação?</span> <br />
        <strong>Isso será irreversível!</strong>
      </ConfirmModal>
    </div>
  )
}

export default ListaDisplay