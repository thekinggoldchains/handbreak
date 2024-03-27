import { faCopy, faEdit } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DataTable from "react-data-table-component"
import { getDisplays, cloneDisplay, deleteDisplay } from "../../../actions/display"
import React, { useState, useEffect } from "react"
import { faClone, faEye, faLink, faPlay, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { display } from "../../../stores"
import Router from 'next/router'
import { getMidiaPorUser } from "../../../actions/slide"
import { alerta } from "../../Toasts"


const ListaMidia = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getMidiaPorUser().then(res => {
      if (res) {
        setData(res)
        display.setId(res[0]._id)
      }
    })
  }, [])

  const  copyClipperBoard = async(link) => {
    navigator.clipboard.writeText(link).then(() => {
      alerta('Copiado com sucesso', '')
    }).catch(err => {
      alerta(`Erro: ${err}`, 'erro')
    })
  };

  const columnsTelas = [
    {
      name: "",
      grow: 0.3,
      cell: (row) => (

        <div className="d-flex justify-content-center align-items-center w-100">
          {
            row.type == 'vid' ? (
              <video className="w-75 me-2" controls src={row.externalLink}></video>
            ) : (
              <img className="w-75 me-2" src={row.externalLink}></img>

            )
          }
          <button className="btn btn-primary h-25" bs-data-toggle="tooltip" title="Copiar Url" onClick={() => copyClipperBoard(row.externalLink)} > <FontAwesomeIcon icon={faLink} /></button>
        </div>

      )
    },
    // {
    //   name: "Id",
    //   selector: row => row._id
    // },
    {
      name: "Nome",
      grow: 0.4,
      selector: row => row.name,
    },
    {
      name: "Data",
      grow: 0.3,
      selector: row => new Date(row.lastModified).toLocaleString('pt-BR'),
      sortable: true
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
      console.log('foi!')
      getDisplays().then(res => {
        if (res) {
          setData(res)
        }
      })
      display.setLoading(false)
    })
  }

  const onDelete = (displayId) => {
    display.setLoading(true)

    return deleteDisplay(displayId).then(res => {
      getDisplays().then(res => {
        if (res) {
          setData(res)
        }
      })
      display.setLoading(false)
    })
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
        justifyContent: 'center',
        maxHeight: '100%'
      },
    },
  }

  const paginationOptions = {
    rowsPerPageText: 'Resultados por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [showBtn, setShowBtn] = useState(false)
  const [toggleCleared, setToggleCleared] = React.useState(false);

  const handleRowSelected = React.useCallback(state => {
    setSelectedRows(state.selectedRows);
    setShowBtn(true)
  }, []);

  const contextActions = React.useMemo(() => {
    const handleDelete = () => {

      if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.title)}?`)) {
        setToggleCleared(!toggleCleared);
        setData(differenceBy(data, selectedRows, 'title'));
      }
    };

    return (
      <div className="delete-btn">

      <button className="w-100 d-flex" onClick={handleDelete} style={{ backgroundColor: 'red' }}>
        Delete
      </button>
      <style jsx>
        {
          `
            .delete-btn {
              position: absolute;
              top: 0;
              width: 250px;
              height: 250px;
              background-color: #FF0;
            }
          `
        }
      </style>
      </div>
    );
  }, [data, selectedRows, toggleCleared]);

  return (

    <div className='col-xl-6 mb-4'>
      <div className='card'>
        <div className='card-header col-md-12 d-flex flex-row justify-content-between '>
          <span className='fs-5 fw-bold'>Minhas Mídias ({data ? data.length : 0})</span>
          <div className="d-flex col-md-5 justify-content-end botao flex-row">
            {
              selectedRows.length > 0 && (
                <button className="btn btn-danger justify-content-around me-2">
                  <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
                  <span className="botao flex-4">Deletar</span>
                </button>
              )
            }
            <button className="btn btn-primary justify-content-around">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              <span className="botao flex-4">Nova mídia</span>
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
            selectableRows
            contextActions={contextActions}
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
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
            .delete-btn {
              position: absolute;
              top: 0;
              width: 250px;
              background-color: #FF0;
            }
          `
        }
      </style>
    </div>
  )
}

export default ListaMidia