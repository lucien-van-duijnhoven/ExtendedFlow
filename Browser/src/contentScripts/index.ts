/* eslint-disable no-console */
import { onMessage } from 'webext-bridge/content-script'
import { createApp } from 'vue'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'
import { getSite } from '~/logic/sites';

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[vitesse-webext] Hello world from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
  })

  // mount component to context window
  const container = document.createElement('div')
  container.id = __NAME__
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM
    = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' })
    || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute(
    'href',
    browser.runtime.getURL('dist/contentScripts/style.css'),
  )
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  const app = createApp(App)
  setupApp(app)
  app.mount(root)
})();

(async () => {
  console.group('Content Script')
  const url = window.location.href
  console.log('url', url)

  const site = await getSite(url)

  console.log('On Site load', site)
  console.groupEnd()
  if (site) {
    if (site.block) {
      // naviate to blank page
      window.location.href = 'about:blank'
    }
    else if (site.monochrome) {
      // make page monochrome
      document.body.style.filter = 'grayscale(100%)'
    }
  }
})()
