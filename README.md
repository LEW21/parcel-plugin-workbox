# parcel-plugin-workbox - service worker generator for Parcel

On every rebuild, this [Parcel](https://parceljs.org) plugin will generate a [Workbox](https://developers.google.com/web/tools/workbox/)-based service worker - `sw.js` - and insert a registration code into the `index.html` entry file.

The service worker will pre-cache all the files generated by Parcel.
