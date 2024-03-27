import { faCopy, faEdit } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DataTable from "react-data-table-component"
import { getDisplays, cloneDisplay, deleteDisplay } from "../../../actions/display"
import React, { useState, useEffect } from "react"
import { faClone, faEye, faLink, faPlay, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { display } from "../../../stores"
import Router from 'next/router'
import { deleteMultiple, getMidiaPorUser } from "../../../actions/slide"
import { alerta } from "../../Toasts"
import { getEspaco } from "../../../actions/user"


const ListaMidia = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getMidiaPorUser().then(res => {
      if (res) {
        setData(res)
      }
    })
  }, [])

  const  copyClipperBoard = async(link) => {
    navigator?.clipboard?.writeText(link).then(() => {
      alerta('Copiado com sucesso', '')
    }).catch(err => {
      alerta(`Erro: ${err}`, 'erro')
    })
  };
  
  const onDelete = async() => {
    display.setLoading(true)
    var urls = []
    for (let index = 0; index < selectedRows.length; index++) {
      urls.push(selectedRows[index].externalLink)
    }
    deleteMultiple("", urls).then(res => {
      display.verificaEspaco();
      getMidiaPorUser().then(res => {
        if (res) {
          setData(res)
        }
        display.setLoading(false)
        setSelectedRows([])
      });

    })
  }

  const styleTableTelas = {
    table: {
      style: {
        overflow: 'auto',
        maxHeight: '75vh'
      }
    },
    rows: {
      style: {
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
      },
    },
  }
  
  const columnsTelas = [
    {
      name: "",
      grow: 0.3,
      cell: (row) => (

        <div className="d-flex justify-content-center align-items-center">
          {
            row.type == 'vid' ? (
              <video width={'50%'} className="me-2" controls src={row.externalLink}></video>
            ) : (
              <img width={'30%'} className="me-2" src={row.externalLink}></img>

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
      grow: 0.3,
      selector: row => row.name,
    },
    {
      name: "Tamanho",
      grow: 0.1,
      selector: row => row.tamanho.tamanho + " " + row.tamanho.unidade,
    },
    {
      name: "Data Alteração",
      grow: 0.3,
      selector: row => new Date(row.lastModified).toLocaleString('pt-BR'),
      sortable: true
    },
  ]

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
    console.log(state, "AAAA")
    setShowBtn(true)
  }, []);
  
  return (

    <div className='col-xl-12'>
      <div className='card'>
        <div className='card-header col-md-12 d-flex flex-row justify-content-between '>
          <span className='fs-5 fw-bold'>Minhas Mídias ({data ? data.length : 0})</span>
          <div className="d-flex col-md-5 justify-content-end botao flex-row">
            {
              selectedRows.length > 0 && (
                <button className="btn btn-danger justify-content-around me-2" onClick={onDelete}>
                  <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
                  <span className="botao flex-4">Deletar</span>
                </button>
              )
            }
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
            @media (min-width: 700px) {
              .jbodyX {
                  max-height: 100vh !important;
              }
         }
          `
        }
      </style>
    </div>
  )
}

export default ListaMidia