/**
 * @fileoverview Frame layout for the general admin pages (includes a left
 * sidebar and content on the right)
 */

import { view } from 'react-easy-state'

import Sidebar from './Sidebar'
import { display } from '../../stores'
import SidebarBoot from './SidebarBoot'

const Frame = props => (
  <div className='containerGeral'>
    {/* <Sidebar loggedIn={props.loggedIn} display={display.id} /> */}
    <SidebarBoot loggedIn={props.loggedIn} display={display.id} />
    <div className='content'>{props.children}</div>
    <style jsx>
      {`
        .containerGeral {
          display: flex;
          flex-direction: row;
          flex: 1;
          border-radius: 0 80px 0 0 !important;
          background: #f4f4f4;
          font-family: 'Open-sans';
          min-height: 100% !important;

        }
        .content {
          margin-left: 80px;
          padding: 40px;
          background: #f4f4f4;
          flex: 1;
          font-family: 'Open Sans', sans-serif;
          min-height: 100vh !important;
        }
        @media (max-width: 992px) {
          .content {
            padding: 0;
            margin: 0;
            background: #f4f4f4;
            flex: 1;
            font-family: 'Open Sans', sans-serif;
            min-height: 100% !important;
          }
      `}
    </style>
  </div>
)

export default view(Frame)
