import App, { Container } from 'next/app'
import React from 'react'
import { Workbox } from "workbox-window";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/GridLayoutStyles.scss'
import 'rc-slider/assets/index.css';


import '@fortawesome/fontawesome-svg-core/styles.css'


export default class NextApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  // componentDidMount() {
  //   if (
  //     !"serviceWorker" in navigator
  //   ) {
  //     console.warn("Pwa support is disabled");
  //     return;
  //   }

  //   navigator.serviceWorker
  //   .register('/service-worker.js')
  //   .then((registration) => console.log('scope is: ', registration.scope));
  // }

  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          draggable={false}
          pauseOnVisibilityChange
          closeOnClick
          pauseOnHover
        />
      </>
    )
  }
}
