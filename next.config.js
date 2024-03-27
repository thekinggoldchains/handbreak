// const withCSS = require('@zeit/next-css')
const withImages = require("next-images");
const withOffline = require("next-offline");
const path = require('path');
// const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
const withWorkbox = require("next-with-workbox");

// module.exports = withWorkbox(withImages({
//   // workbox: {
//   //   dest: "/",
//   //   swDest: "service-worker.js",
//   //   swSrc: "worker.js",
//   //   force: true,
//   //   maximumFileSizeToCacheInBytes: 500000000, // 500 MB
//   // },
//   images: {
//     disableStaticImages: true
//   },
//   sassOptions: {
//     includePaths: [path.join(__dirname, 'styles')],
//   }
// }))

module.exports = withImages({
  // workbox: {
  //   dest: "/",
  //   swDest: "service-worker.js",
  //   swSrc: "worker.js",
  //   force: true,
  //   maximumFileSizeToCacheInBytes: 500000000, // 500 MB
  // },
  images: {
    disableStaticImages: true
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  }
})


