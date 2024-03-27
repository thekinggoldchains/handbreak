import Axios from "axios"
import { result } from "lodash"

// DASHBOARD (CRUD)

export const getDashboard = async (host = "") => {
    return Axios.get(host + "/api/v1/dashboard/").then((res) => {

      res.data.allUsers.forEach(user => {
        const licencas = res.data.usersFranquia.filter(licenca => licenca.userFranqueadoId === user._id)

        user.licencas = licencas.length > 0 ? licencas[0].licencas : 0
        user.telas = res.data.allDisplays.filter(tela => {
          return tela.userId === user._id
        })
        user.usersFranqueados = null;
        if (user.role === "franqueador") {

          const usersFranqueadosValidos = res.data.usersFranquia.filter(franqueado => {return franqueado.userFranqueadorId})
          const userFranqueados = res.data.allUsers.filter(user => usersFranqueadosValidos.find(franqueado => franqueado.userFranqueadoId.toString() == user._id.toString()))

          user.usersFranqueados = userFranqueados;
        }

      })
      return res.data
    }).catch(err => console.log(err))
}

export const criaUsuario = (data, host = "") => {
    return Axios.post(host + "/api/v1/dashboard/", data).then(res => {
      return res.data
    })
  }
  export const atualizaUsuario = (id, data, host = "") => {
    return Axios.patch(host + "/api/v1/dashboard/" + id, data).then(res => {
      return res.data
    })
  }
  export const deletaUsuario = (id, data, host = "") => {
    return Axios.delete(host + "/api/v1/dashboard/" + id).then(res => {
      return res.data
    })
  }
