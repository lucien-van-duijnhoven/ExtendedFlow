import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'
import { getSite, updateSite } from '~/logic/sites'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  }
  catch {
    return
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  sendMessage(
    'tab-prev',
    { title: tab.title },
    { context: 'content-script', tabId },
  )
})

onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.get(previousTabId)
    return {
      title: tab?.title,
    }
  }
  catch {
    return {
      title: undefined,
    }
  }
})

// default values
browser.storage.local.set({
  sites: [
    {
      url: 'https://www.youtube.com/',
      monochrome: true,
      block: false,
    },
    {
      url: 'https://www.facebook.com/',
      monochrome: false,
      block: true,
    },
  ],
})

const ws = new WebSocket('ws://localhost:4000')
ws.onopen = () => {
  console.log('connected')
  ws.send('something')
}
ws.onmessage = async (e) => {
  const message = e.data as 'grayscale' | 'block'
  console.log(message)

  // get current selcted tab
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  const tab = tabs[0]
  const url = tab.url
  if (url === undefined)
    return

  const currentSite = await getSite(url)

  if (message === 'grayscale') {
    updateSite({
      ...currentSite,
      monochrome: !currentSite.monochrome,
    })
  }
  if (message === 'block') {
    updateSite({
      ...currentSite,
      block: !currentSite.block,
    })
  }
}
ws.onerror = (e) => {
  console.error(e)
}
ws.onclose = (e) => {
  console.log(e.code, e.reason)
}
