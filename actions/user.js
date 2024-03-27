import axios from 'axios'
import Router  from 'next/router';
import { destroyCookie } from 'nookies';
import { alerta } from '../components/Toasts';

// USUARIOS (CRUD)
export const getUsers = (host = '') => {
  return axios.get(host + '/api/v1/user').then(res => {
    if (res && res.data) {
        res.data.usuarios.forEach(async function (user) {
          user.telas = await res.data.telas.filter(function (item) {
            return item.userId === user._id;
          });
        });

      return res.data
    }
  })
}

export const getUser = (id, host = '') => {
  return axios.get(host + '/api/v1/user/info/' + id).then(res => {
    if (res && res.data && res.data.error) {
      return alerta(res.data.error, 'erro')
    } else {
      return res.data
    }
  })
}

export const getEspaco = (id, host = '') => {
  return axios.get(host + '/api/v1/user/espaco').then(res => {
    if (res && res.data) {
      return res.data.espaco
    }
  })
}


// FRANQUEADOS (CRUD)

export const getFranqueadosUsers = (host = '') => {
  return axios.get(host + '/api/v1/user/franqueados').then(res => {
    if (res && res.data) {
        res.data.usuarios.forEach(async function (user) {
          user.telas = await res.data.telas.filter(function (item) {
            return item.userId === user._id;
          });
          let result = res.data.franqueadoDetalhes.filter(function (item) {
            return item.userFranqueadoId === user._id;
          })
          user.franquiaDetalhe = result[0]
        });

      return res.data
    }
  })
}
export const criaFranqueado = (data, host = "") => {
  return axios.post(host + "/api/v1/user/franqueados", data).then(res => {
    return res.data
  })
}
export const atualizaFranqueado = (id, data, host = "") => {
  return axios.patch(host + "/api/v1/user/franqueados/" + id, data).then(res => {
    return res.data
  })
}

export const deletaFranqueado = (id, host = "") => {
  return axios.delete(host + "/api/v1/user/franqueados/" + id).then(res => {
    return res.data
  })
}

// AUTENTICAÇOES ETC
export const logout = (host = '') => {
  return axios.get(host + '/api/v1/user/logout').then(res => {
    if (res && res.data) {
      destroyCookie({}, 'loggedIn')
      destroyCookie({}, 'loggedUser')
      destroyCookie({}, 'loggedUserId')
      destroyCookie({}, 'role')
      Router.push('/login')
      window.location.href = '/login'
    }
    return res.data
  })
}
