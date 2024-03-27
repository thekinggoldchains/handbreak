/**
 * Overloads the _document container from Next.js in order to add custom fonts
 */

import Document, { Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import logo from '../assets/icon.ico'


class AppDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: [
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>,
        ],
      }
    } finally {
      sheet.seal()
    }
  }
  render() {
    return (
      <Html>
        <Head title='Etag Digital'>
          <style>{'body { margin: 0 } /* custom! */'}</style>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta charSet='utf-8' />
          <link rel="icon" type="image/x-icon" href={logo} />

          <link rel="preconnect" href="//fonts.googleapis.com" />
          <link rel="preconnect" href="//fonts.gstatic.com" crossorigin />
          <link href="//fonts.googleapis.com/css2?family=Inconsolata:wght@500&family=Open+Sans&family=Roboto&family=Rubik+Dirt&family=Silkscreen&display=swap" rel="stylesheet" />
          <script src='https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.1/socket.io.js' />
          {this.props.styleTags}
        </Head>
        <body>
          <div id="loadingContent"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
