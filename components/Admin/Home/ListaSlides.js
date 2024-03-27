import React, { useState, useEffect } from "react"
import DataTable from "react-data-table-component"
import { getSlideshows, cloneSlideshow } from '../../../actions/slideshow'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClone, faEdit, faEye, faTrashAlt } from "@fortawesome/free-regular-svg-icons"
import Router from "next/router"
import { display } from "../../../stores"


const ListaSlides = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getSlides();
  }, [])

  const openSlide = (id) => {
    Router.push('/slideshow/' + id + '?' + display.id)
  }
  const columnsTelas = [
    {
      name: "Ações",
      grow: 0.4,
      cell: (row) => (

        <div className="d-flex">
          <button className='btn btn-warning white me-2' data-bs-toggle="tooltip" data-bs-placement="top" title="Duplicar" onClick={() => cloneSlideshow(row._id)}>
            <FontAwesomeIcon
              icon={faClone}
            />
          </button>
          <button className='btn btn-secondary me-2' data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" onClick={() => openSlide(row._id)}>
            <FontAwesomeIcon
              icon={faEdit}
            />
          </button>

        </div>

      )
    },
    {
      name: "Nome",
      grow: 0.4,
      selector: row => row.title ?? 'Sem Titulo',
      sortable: true
    },
    {
      name: "Total Slides",
      grow: 0.3,
      selector: row => row.slides.length ?? 'Sem Titulo',
      sortable: true
    },
  ]


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



  const getSlides = async () => {
    await getSlideshows().then(res => {
      setData(res)
    })
  }
  return (

    <div className='col-xl-6 mb-4'>
      <div className='card'>
        <div className='card-header col-md-12 d-flex flex-row justify-content-between '>
          <span className='fs-5 fw-bolder'>Meus Slideshows ({data ? data.length : 0})</span>
          <div className="col-md-6 botao d-flex justify-content-end">
            <button className="btn btn-primary justify-content-around" onClick={() => {Router.push('/slideshows?'+ display.id)}}>Ver Todos</button>
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
    </div>
  )


}

export default ListaSlides