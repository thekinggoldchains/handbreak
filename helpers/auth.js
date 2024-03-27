import Router from 'next/router'
import axios from 'axios'
import React, { cache } from 'react'
import { parseCookies, setCookie, destroyCookie } from 'nookies'

import { getDisplays } from '../actions/display'
import displayStore  from '../stores/display.js'

export const login = ({ username, password }, host = '', displayId) => {
  return axios.post(host + '/api/v1/user/login', { username, password }).then(async(res) => {
    if (res && res.data && res.data.success) {
      let display;

      setCookie(res, 'loggedUser', JSON.stringify(res.data.user), {
        maxAge: 86400,
        path: '/'
      })
      setCookie(res, 'loggedUserId', res.data.user._id, {
        maxAge: 86400,
        path: '/'
      })
      setCookie(null, 'role', res.data.user.role, {
        maxAge: 86400,
        path: '/'
      })
      setCookie(null, 'loggedIn', true, {
        maxAge: 86400,
        path: '/'
      })
      await getDisplays(host).then(displayList => {
          display = displayList[0]._id;
      })
      Router.push('/' + (displayId ? '?display=' + displayId : display ? '?display=' + display : ''))
      window.location.href = '/' + (displayId ? '?display=' + displayId : display ? '?display=' + display : '')
    }
    return res.data
  })
}

export const logout = (host = '') => {
  return axios.get(host + '/api/v1/user/logout').then(res => {
    if (res && res.data) {
      destroyCookie({}, 'loggedIn')
      destroyCookie({}, 'loggedUser')
      destroyCookie({}, 'loggedUserId')
      destroyCookie({}, 'role')
      destroyCookie({}, 'display')
      caches.delete('v1').then(function (boolean) {
        console.log('Cache limpo com sucesso!');
      });
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
      Router.push('/login')
      window.location.href = '/login'
    }
    return res.data
  })
}

export const protect = Component =>
  class ProtectedPage extends React.Component {
    static async getInitialProps(ctx) {
      const { req, res, query } = ctx
      const alreadyLoggedIn = parseCookies(ctx).loggedIn
      const role = parseCookies(res).role
      const host =
        req && req.headers && req.headers.host
          ? 'https://' + req.headers.host
          : window.location.origin

      if ((req && req.user) || alreadyLoggedIn) {
        if (!alreadyLoggedIn) {
          setCookie(null, 'loggedIn', true, {
            maxAge: 86400,
            path: '/'
          })
        }
        let displayId = query && query.display
        // if (!displayId) {
        //   const displayList = await getDisplays(host)
        //   // displayId = displayList[0]._id
        // }
        const props = Component.getInitialProps ? await Component.getInitialProps({ ...ctx }) : {}
        return {
          ...props,
          displayId,
          host,
          loggedIn: true,
          role: role
        }
      } else {
        if (req) {
          res.writeHead(302, { Location: '/login' })
          res.end()
        } else {
          Router.push('/login')
        }
        return {}
      }
    }

    render() {
      return <Component {...this.props} />
    }
  }
