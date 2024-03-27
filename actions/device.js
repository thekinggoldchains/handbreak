import axios from 'axios'
import display from "../stores/display"
import { alerta } from '../components/Toasts'

export const addDevice = (data, host = '') => {
  display.setLoading(true)
  console.log(data)
  return axios.post(host + '/api/v1/device', data).then(res => {
    if (res && res.data) {
      display.setLoading(false)
      return res.data
    }
  }).catch(err => {
    alerta(`Erro: ${err.message}`)
  })
}

export const getDevices = (host = '') => {
  display.setLoading(true)
  return axios.get(host + '/api/v1/device').then(res => {
    if (res && res.data) {
      display.setLoading(false)
      return res.data
    }
  })
}

export const getDevice = (id, host = '') => {
  display.setLoading(true);
  return axios.get(host + '/api/v1/device/' + id).then(res => {
    if (res && res.data) {
      display.setLoading(false)
      return res.data
    }
  })
}

export const updateDevice = (data, host = '') => {
  display.setLoading(true)
  console.log("update")
  console.log(data)
  return axios.patch(host + `/api/v1/device/${data._id}`, data).then(res => {
    if (res && res.data) {
      display.setLoading(false)
      return res.data
    }
  }).catch(err => {
    alerta(`Erro: ${err.message}`)
  })
}

export const updateDevices = (data, host = '') => {
  display.setLoading(true)
  console.log(data)
  return axios.patch(host + `/api/v1/device`, {
    devices: data
  }).then(res => {
    if (res && res.data) {
      display.setLoading(false)
      return res.data
    }
  }).catch(err => {
    alerta(`Erro: ${err.message}`)
  })
}

export const deleteDevice = (id, host = '') => {
  try {
    return axios.delete(host + '/api/v1/device/' + id)

  } catch (err) {
    return alerta(`Erro: ${err}`, 'erro')

  }
}
export const verificaCodigo = (data, host = '') => {

  return axios.post(host + '/api/v1/device/codigo', data)
    .then(res => {
      return res;
    })
    .catch(err => {
      if (err.response && err.response.data && err.response.data.error) {
        return alerta(`${err.response.data.error}`, 'erro');
      }
    });

}
export const getDeviceCodigo = (data, host = '') => {
  try {
    return axios.get(host + '/api/v1/device/codigo/' + data)

  } catch (err) {
    return alerta(`${err?.response?.data?.error}`, 'erro')

  }
}
