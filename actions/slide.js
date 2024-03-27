import axios from 'axios'
import { alerta } from '../components/Toasts'
import display, { setLoading } from '../stores/display'

export const getSlides = (slideshow, host = '') => {
    return axios.get(host + '/api/v1/slideshow/' + slideshow + '/slides').then(res => {
      if (res && res.data) {
        return res.data
      }
    }).catch(err => {
      return alerta("É necessario atribuir algum slideshow ao widget", 'erro')
    })

}

export const getSlide = (slide, host = '') => {
  return axios.get(host + '/api/v1/slide/' + slide).then(res => {
    if (res && res.data) {
      return res.data
    }
  }).catch(err => {
    return alerta(`Erro: ${err}`, 'erro')
  })
}

export const deleteSlide = (id, host = '') => {
  try {
    return axios.delete(host + '/api/v1/slide/' + id)

  } catch (err) {
    return alerta(`Erro: ${err}`, 'erro')

  }
}

export const updateSlide = (id, file, data, host = '') => {
  try {

    const formData = new FormData()
    for (const key of Object.keys(data)) {
      formData.append(key, data[key])
    }
    if (file) formData.append('data', file)
    return axios.patch(host + '/api/v1/slide/' + id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  } catch (err) {
    return alerta(`Erro: ${err}`, 'erro')

  }
}

export const addSlide = (slideshow, file, data, host = '') => {
  try {
    const formData = new FormData()
    for (const key of Object.keys(data)) {
      formData.append(key, data[key])
    }
    if (file) formData.append('data', file)
    formData.append('slideshow', slideshow)
    return axios.post(host + '/api/v1/slide', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

  } catch (err) {
    return alerta(`Erro: ${err}`, 'erro')

  }
}

export const standaloneUpload = (file, host = '') => {
  try {
    const formData = new FormData()
    formData.append('data', file)
    return axios.post(host + '/api/v1/slide/standalone_upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  } catch (err) {
    return alerta(`Erro: ${err}`, 'erro')

  }
}


export const getUsedSpace = (host = '') => {
  try {

    return axios.get(host + '/api/v1/slide/usedSpace/').then(res => {
      return res
    })
  } catch (err) {
    return alerta(`Erro: ${err}`, 'erro')

  }
}

export const getMidiaPorUser = (host = '') => {
  try {

    return axios.get(host + '/api/v1/slide/midias/').then(res => {
      return res.data
    })
  } catch (err) {
    return alerta(`Erro: ${err}`, 'erro')

  }
}

export const deleteGenerico = (host = '', url) => {
  try {
    return axios.post(host + '/api/v1/slide/deletaRecurso/', {
      url: url
    }).then(res => {
      if (res) {
        alerta('Sucesso', '')
      }
      return res
    })
  } catch (err) {
    return alerta(`Erro: ${err}`, 'erro')
  }
}
export const deleteMultiple = (host = '', url) => {
  try {
    return axios.post(host + '/api/v1/slide/deletaMultiple/', {
      url: url
    }).then(res => {
      if (res) {
        alerta('Sucesso', '')
      }
      return res
    })
  } catch (err) {
    return alerta(`Erro: ${err}`, 'erro')
  }
}
