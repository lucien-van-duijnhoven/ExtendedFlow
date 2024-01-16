async function getSites(): Promise<Site[]> {
  const storage = await browser.storage.local.get('sites')
  return storage.sites || []
}

async function setSites(sites: Site[]) {
  await browser.storage.local.set({ sites })
}

async function getSite(url: string) {
  const sites = await getSites()
  return sites.find(site => site.url === url)
}

async function addSite(site: Site) {
  const sites = await getSites()
  sites.push(site)
  await browser.storage.local.set({ sites })
}

async function updateSite(site: Site) {
  const sites = await getSites()
  const index = sites.findIndex(s => s.url === site.url)
  if (index === -1) {
    addSite(site)
  }
  else {
    sites[index] = site
    await browser.storage.local.set({ sites })
  }
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
