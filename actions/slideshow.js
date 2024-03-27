import axios from 'axios'
import { deleteSlide, getSlides } from './slide'
import {display} from '../stores'

export const getSlideshows = (host = '') => {
  return axios.get(host + '/api/v1/slideshow').then(res => {
    if (res && res.data) {
      return res.data
    }
  })
}
export const getSlideshowsDisplay = (host = '') => {
  return axios.get(host + '/api/v1/slideshow/type/' + 'display').then(res => {
    if (res && res.data) {
      return res.data
    }
  })
}

export const addSlideshow = (host = '', tipo) => {
  let data = {
    type: tipo
  }
  return axios.post(host + '/api/v1/slideshow', data).then(res => {
    if (res && res.data) {
      return res.data
    }
  })
}

export const cloneSlideshow = (slideshowId, host = '') => {
  return axios.post(host + '/api/v1/slideshow/clone/' + slideshowId).then(res => {
    if (res && res.data) {
      return res.data
    }
  })
}

export const getSlideshow = (id, host = '') => {
  return axios.get(host + '/api/v1/slideshow/' + id).then(res => {
    if (res && res.data) {
      return res.data
    }
  })
}

export const deleteSlideshow = async (id, host = '') => {
  const slides = await getSlides(id)
  if(slides.length > 0){
    await slides.forEach(slide => {
      deleteSlide(slide._id)
    })
  }
  return axios.delete(host + '/api/v1/slideshow/' + id).then(res => {
    if (res && res.data) {
      return res.data
    }
  })
}

export const updateSlideshow = (id, data, host = '') => {
  data.displayId = display.id
  return axios.patch(host + '/api/v1/slideshow/' + id, data).then(res => {
    if (res && res.data) {
      return res.data
    }
  })
}

export const reorderSlides = (id, oldIndex, newIndex, host = '') => {
 const displayId = display.id

  return axios
    .patch(host + '/api/v1/slideshow/' + id + '/reorder', { oldIndex, newIndex, displayId })
    .then(res => {
      if (res && res.data) {
        return res.data
      }
    })
}
