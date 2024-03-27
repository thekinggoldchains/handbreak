/**
 * @fileoverview Slideshow component that given an array of slide descriptions
 * of mixed slideshowTypes, renders the slides and automatically plays the slideshow for
 * the given durations
 */

import React, { Component } from 'react'
import Marquee from "react-fast-marquee";
import _, { reject } from 'lodash'

import GenericSlide from './Slide/Generic'
import PhotoSlide from './Slide/Photo'
import YoutubeSlide from './Slide/Youtube'
import WebSlide from './Slide/Web'
import VideoSlide from './Slide/Video'
import Progress from './Progress'

import { getSlides } from '../../../actions/slide'
import TextSlide from './Slide/Text';
import Axios from 'axios';
import { display } from '../../../stores';

const DEFAULT_DURATION = 5000
const DEFAULT_SLIDE_TYPE = 'normal'

class Slideshow extends Component {
  constructor(props) {
    super(props)

    const { data: {
      slideshowType,
      speedRoll,
      directionRoll,
      showProgress
    } = {} } = this.props
    this.slideRefs = []

    this.state = {
      current: null,
      slides: [],
      ready: false,
      slideshowOptions: {
        slideshowType: 'normal',
        speedRoll: 200,
        directionRoll: 'right',
        showProgress:  true,
        fit: 'contain'
      }
    }
    this.blobURLs = [];
  }

  async componentDidMount() {
    const { data } = this.props
    display.setLoading(true);
    getSlides(data).then(async slides => {
      // await this.deleteDatabaseIndex();
      for (const [index, video] of slides.slides.entries()) {
        if (video.data && video.data.match(/\.(jpg|jpeg|png|gif|mp4|webm|mov)$/)) {
          // await this.downloadVideo(video.data);
          const regex = /[^/]+\/([^/]+)\/([^/]+)/;
          const match = video.data.match(regex);
          var novaUrl = '';

          if (match) {
            const clienteId = match[1];
            const video = match[2];
            const cloudFrontPrefix = "https://d3h6ziiccg10z4.cloudfront.net/";
            novaUrl = cloudFrontPrefix + clienteId + "/" + video;
          }
          video.data = novaUrl
        }
      }
      this.setState({ current: 0, slides: slides.slides, slideshowOptions: slides.slideshowOptions }, this.waitForNextSlide)
    display.setLoading(false);

    })
  }
  async downloadVideo(link) {
    try {
      // const link = await JSON.stringify({link: link})
      const res = await Axios.get('/api/v1/slide/video/', {
        params: {
          link: `${link}`
        }
      });

      const uint8Array = new Uint8Array(res.data.data);
      const blob = new Blob([uint8Array], { type: res.headers['content-type'].split(";")[0] });
      const blobURL = URL.createObjectURL(blob);
      this.blobURLs.push(blobURL);

      // this.setFilesInIndexDB(blob, link, blobURL);
    } catch (error) {
      console.error(error);
    }
  }
  // async deleteDatabaseIndex() {
  //   return new Promise((resolve, reject) => {
  //     const request = indexedDB.open('midias', 1);

  //     request.onsuccess = event => {
  //       resolve();
  //     };

  //     request.onupgradeneeded = event => {
  //       console.log("aqui!! > upgraded")
  //       const db = event.target.result;
  //       if(db.objectStoreNames.contains('videos') ) {
          
  //         const transaction = db.transaction(['videos'], 'readwrite');
  //         const objectStore = transaction.objectStore('videos');
          
  //         // Limpa todos os dados no objeto de armazenamento
  //         const clearRequest = objectStore.clear();
  //         clearRequest.onsuccess = event => {
  //         console.log('Dados excluídos com sucesso.');
  //         resolve();
  //       };
        
  //       clearRequest.onerror = event => {
  //         console.error('Erro ao excluir dados:', event.target.error);
  //         resolve();
  //       };
  //     }
  //     else {
  //       db.createObjectStore('videos', { keyPath: 'name' });
  //       resolve();
  //     }
  //     }


  
  //     request.onerror = event => {
  //       console.error('Erro ao abrir o banco de dados:', event.target.error);
  //       resolve();
  //     };
  //   });
  // }

// async setFilesInIndexDB(blob, link, url) {
//   const filename = link.split('/').pop();

//   // Abre o banco de dados ou cria um se ele não existir
//   const db = await new Promise((resolve, reject) => {
    
//     const request = indexedDB.open('midias', 1);
//     request.onsuccess = event => {
//       const db = event.target.result;
//       resolve(db);
//     }
//     request.onupgradeneeded = event => {
//       const db = event.target.result;
//       db.createObjectStore('videos', { keyPath: 'name' });
//       resolve(db);
//     };
//   });

//   // Adiciona o vídeo ao banco de dados
//   const transaction = db.transaction(['videos'], 'readwrite');
//   const objectStore = transaction.objectStore('videos');
//   const data = { name: filename, blob: blob, url: url }; // Adicione o URL do objeto

//   objectStore.add(data);
// }

  /**
   * Sorts the slides by the given `order` value of each slide and returns the
   * slides array in the sorted order
   * @return {Array}
   */
  get orderedSlides() {
    const { slides } = this.state
    return _.sortBy(slides, 'order')
  }

  /**
   * Moves to the next slide (and loops back if on the last slide)
   * @return {Promise}
   */
  nextSlide = () => {
    const { current, slides } = this.state
    return new Promise(resolve => {
      this.setState(
        {
          current: (current + 1) % slides.length
        },
        () => {
          const { current } = this.state
          const prev = (((current - 1) % slides.length) + slides.length) % slides.length
          this.slideRefs[prev].stop()
          this.slideRefs[current].play()
          resolve()
        }
      )
    })
  }

  /**
   * Waits for the duration specified by each slide then moves to the next slide
   * and waits again
   */
  waitForNextSlide = () => {
    const { defaultDuration = DEFAULT_DURATION } = this.props
    const { current } = this.state
    const currentSlide = this.orderedSlides[current]
    this.setState({ ready: false }, () => {
      this.slideRefs[current] &&
        this.slideRefs[current].loadedPromise.then(() => {
          this.setState({ ready: true })
          setTimeout(
            () =>
              this.nextSlide().then(() => {
                this.waitForNextSlide()
              }),
            (currentSlide && currentSlide.duration * 1000) || defaultDuration
          )
        })
    })
  }

  getSlideComponent = type => {
    switch (type) {
      case 'photo':
        return PhotoSlide
      case 'youtube':
        return YoutubeSlide
      case 'web':
        return WebSlide
      case 'video':
        return VideoSlide
      case 'text':
        return TextSlide
      default:
        return GenericSlide
    }
  }

  renderSlide = (slide, index) => {
    const { current } = this.state
    const { type } = slide

    const SlideComponent = this.getSlideComponent(type)

    return (
      <SlideComponent
        key={index}
        slide={slide}
        show={index == current}
        ref={ref => (this.slideRefs[index] = ref)}
        slideshowType={this.state.slideshowOptions.slideshowType}
      />
    )
  }

  renderScroll = (slide, index) => {
    const { type } = slide
    const SlideComponent = this.getSlideComponent(type)
    return (
      <SlideComponent
        key={index}
        slide={slide}
        show={true}
        ref={ref => (this.slideRefs[index] = ref)}
        slideshowType={this.state.slideshowOptions.slideshowType}
      />
    )
  }

  render() {
    const { defaultDuration = DEFAULT_DURATION } = this.props
    const { current, ready, slides, slideshowOptions: {
      slideshowType,
      speedRoll,
      directionRoll,
      showProgress
    } = {} } = this.state

    return (
      <div className={'slideshow'}>
        {
          slideshowType == 'normal' ? (
            <div className='slideshow-wrapper'>
              {this.orderedSlides.map((slide, index) => this.renderSlide(slide, index))}
            </div>
          ) :
            (
              <Marquee
                style={{ height: '100%' }}
                direction={directionRoll}
                gradient={false}
                speed={speedRoll}>
                {slides?.map((slide, index) => this.renderScroll(slide, index))}
              </Marquee>
            )

        }

        {(showProgress && showProgress == true && slideshowType == 'normal') && (
          <Progress
            defaultDuration={defaultDuration}
            current={current}
            orderedSlides={this.orderedSlides}
            ready={ready}
          />
        )}
        <style jsx>
          {`
            .slideshow {
              display: block;
              position: relative;
              flex: 1;
              overflow: hidden;
              width: 100%;
              height: 100%;
            }
            .slideshow-wrapper {
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
          `}
        </style>
      </div>
    )
  }
}

export default Slideshow
