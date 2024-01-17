async function getSites(): Promise<Site[]> {
  const storage = await browser.storage.local.get('sites')
  return storage.sites || []
}

async function setSites(sites: Site[]) {
  await browser.storage.local.set({ sites })
  reloadCurrentTab()
}

async function getSite(url: string) {
  const sites = await getSites()
  const index = sites.findIndex(site => site.url === url)
  if (index === -1)
    return makeSite(url)
  else return sites[index]
}

async function addSite(site: Site) {
  const sites = await getSites()
  sites.push(site)
  await setSites(sites)
}

async function updateSite(site: Site) {
  const sites = await getSites()
  const index = sites.findIndex(s => s.url === site.url)
  if (index === -1) {
    addSite(site)
  }
  else {
    sites[index] = site
    await setSites(sites)
  }
}

function reloadCurrentTab() {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs.reload(tabs[0].id)
  })
}

function makeSite(url: string): Site {
  return {
    url,
    monochrome: false,
    block: false,
  }
}

export interface Site {
  url: string
  monochrome: boolean
  block: boolean
}
export { getSites, getSite, addSite, updateSite, setSites, makeSite }
