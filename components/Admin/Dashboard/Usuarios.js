import React, { useRef, useState, useImperativeHandle, useMemo, useCallback, useEffect  } from 'react'
import { getUsers } from "../../../actions/user"
import styles from './styles.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faChevronDown, faChevronRight, faTrash, faEye } from "@fortawesome/free-solid-svg-icons"
import DataTable from 'react-data-table-component';
import UsuarioCreate from '../Dashboard/Forms/UsuarioCreate'
import Displays from "./Displays";
import UsuarioEdit from "./Forms/UsuarioEdit";
import { deletaUsuario } from '../../../actions/dashboard';
import { alerta } from '../../Toasts';


const Usuarios = (props) => {

  const {data, show} = props;

  const dialogEdit = useRef(null)
  const dialogDisplay = useRef(null);

  const [isVarejoShowing, setIsVarejoShowing] = useState(false);
  const [isAtacadoShowing, setIsAtacadoShowing] = useState(false);
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [selectedUserEdit, setSelectedUserEdit] = useState({})

  const expand = (e) => {
    switch (e) {
      case 1:
        setIsVarejoShowing(!isVarejoShowing)
        break;
      case 2:
        setIsAtacadoShowing(!isAtacadoShowing)
        break;
      default: 'ué'
        break;
    }
  }

  async function deleteData(id) {
    return deletaUsuario(id).then((res) => {
        if (res.success == false) {
            alerta(res.msg, 'erro')
        } else {
            alerta(res.msg, '')
            props.refresh()
        }
    })
}
  
  const openDisplay = async(e, data) => {
    setSelectedDisplay(data._id)
    if (e) e.stopPropagation()
    dialogDisplay.current?.openDisplay()
  }
  
  const edit = (e, data) => {
    setSelectedUserEdit(data)
    if (e) e.stopPropagation()
    dialogEdit.current?.edit();
  }


    const columns = useMemo(() => [
      {
        name: 'Ações',
        button: true,
        cell: (row) => (

          <div style={{ flexDirection: "row", display: 'flex' }}>
            <button className={styles.edit}
              onClick={(e) => edit(e, row)}>
              <FontAwesomeIcon
                icon={faEdit}
                fixedWidth
                color='#fff'
              />
            </button>
            <button className={styles.delete} onClick={() => deleteData(row._id)}>
              <FontAwesomeIcon
                icon={faTrash}
                fixedWidth
                color='#fff'

              />
            </button>
          </div>

        )
      },
      {
        name: "Id",
        selector: row => row._id,
        style: {
          fontSize: 15,
          fontWeight: 'bold'
        }
      },
      {
        name: "Nome",
        selector: row => row.name,
        sortable: true
      },
      {
        name: "E-mail",
        selector: row => row.email ? row.email : "Não Cadastrado",
        sortable: true
      },
      {
        name: "Tipo de Usuário",
        cell: (row) => {
          let tipoUsuario = '';
          switch (row.role) {
            case 'user':
              tipoUsuario = "Padrao"
              break;
            case 'admin':
              tipoUsuario = "Administrador"
              break;
            case 'franqueador':
              tipoUsuario = "Franqueador"
              break;
            default: ''
              break;
          }
          return (
            <span>{tipoUsuario}</span>
          )
        }

      },
      {
        name: "Licenças Totais",
        selector: row => row.licencas,
      },
      {
        name: "Licenças Utilizadas",
        selector: row => row.telas.length,
      }
    ], []) 

    const styleTable = {
      table: {
        style: {
          margin: '25px 0',
        }
      },
      rows: {
        style: {
          minHeight: '72px',  // substituir a altura da linha 
        }
      },
      headCells: {
        style: {
          backgroundColor: '#9900CC',
          color: '#ffffff',
          textAlign: 'left',
          fontSize: 18,
        }
      },
      cells: {
        style: {
          padding: ('12px 15px'),
          fontSize: 16,
        },
      },
    }

    const paginationOptions = {
      rowsPerPageText: 'Resultados por página',
      rangeSeparatorText: 'de',
      selectAllRowsItem: true,
      selectAllRowsItemText: 'Todos',
    };

    const ExpandedComponent = ({ data }) => {
      const columnsTelas = [
        {
          name: "Ações",
          button: true,
          cell: (row) => (

            <div style={{ flexDirection: "row", display: 'flex' }}>
              <button className={styles.openDisplay} onClick={(e) => openDisplay(e, row)}>
                <span>Ver </span>
                <FontAwesomeIcon
                  icon={faEye}
                />
              </button>

            </div>

          )
        },
        {
          name: "Display Id",
          selector: row => row._id
        },
        {
          name: "Display Nome",
          selector: row => row.name,
          sortable: true
        },
        {
          name: "Widgets adicionados",
          selector: row => row.widgets.length,
          grow: 0.5,
          style: {
            fontWeight: 'bold',
            fontSize: 18
          }
        }
      ]
      const columnsFranqueados = [

      ]
      const styleTableTelas = {
        table: {
          style: {
            marginBottom: 25,
            border: '1px solid #e4e7ea'
          }
        },
        rows: {
          style: {
            minHeight: '72px',  // substituir a altura da linha 
          }
        },
        headCells: {
          style: {
            fontSize: 18,
            border: '1px solid #e4e7ea'

          }
        },
        cells: {
          style: {
            // padding: ('12px 15px'),
            fontSize: 16,
            border: '1px solid #e4e7ea'

          },
        },
      }
      return (
        <div style={{padding: 25, fontSize: 24}}>
        {
          data.usersFranqueados && (
          <div onClick={(e) => expand(1)}>
            <span>{`Franqueados de ${data.name.toLowerCase()}`}</span>
            <DataTable
              columns={columns}
              data={data.usersFranqueados}
              customStyles={styleTableTelas}
              pagination
              fixedHeader
              paginationComponentOptions={paginationOptions}
              expandableRows expandableRowsComponent={ExpandedComponent}
            />
            </div>
          )
        }
        <DataTable
        title={`Displays de ${data.name.toLowerCase()}`}
        columns={columnsTelas}
        data={data.telas}
        customStyles={styleTableTelas}
        />
        </div>
      ) 
    }

  return (
    <div className={styles.chartsBody}>

      <div className={styles.usersCard}>
        <div className={styles.userCardTitle} id={1}>
          <span> <FontAwesomeIcon icon={'user'} /> Usuários do sistema</span>
          <span>{data.usersVarejo?.length}</span>
          {/* <span> <FontAwesomeIcon icon={isVarejoShowing ? 'chevron-down' : 'chevron-right'} size={'1x'} /></span> */}
        </div>
        <DataTable
          columns={columns}
          data={data.allUsers}
          customStyles={styleTable}
          pagination
          fixedHeader
          paginationComponentOptions={paginationOptions}
          expandableRows expandableRowsComponent={ExpandedComponent}
        />
      </div>
      <Displays ref={dialogDisplay} displayId={selectedDisplay} />
      <UsuarioEdit ref={dialogEdit} data={selectedUserEdit} refresh={props.refresh} />
    </div>
  )


}

export default Usuarios