import { onMessage, sendMessage } from "webext-bridge/background";
import type { Tabs } from "webextension-polyfill";

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import("/@vite/client");
  // load latest content script
  import("./contentScriptHMR");
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log("Extension installed");
});

let previousTabId = 0;

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId;
    return;
  }

  let tab: Tabs.Tab;

  try {
    tab = await browser.tabs.get(previousTabId);
    previousTabId = tabId;
  } catch {
    return;
  }

  // eslint-disable-next-line no-console
  console.log("previous tab", tab);
  sendMessage(
    "tab-prev",
    { title: tab.title },
    { context: "content-script", tabId }
  );
});

onMessage("get-current-tab", async () => {
  try {
    const tab = await browser.tabs.get(previousTabId);
    return {
      title: tab?.title,
    };
  } catch {
    return {
      title: undefined,
    };
  }
});

export type Site = {
  url: string;
  monochrome: boolean;
  block: boolean;
};

browser.storage.local.set({
  sites: [
    {
      url: "https://www.youtube.com/",
      monochrome: true,
      block: false,
    },
    {
      url: "https://www.facebook.com/",
      monochrome: false,
      block: true,
    },
  ],
});

// get storage value from browser
browser.storage.local.get("sites").then((result) => {
  const sites: Site[] = result.sites || [];
  // eslint-disable-next-line no-console
  console.log("sites", sites);
});

// on navigation, get sites from storage and check if current url is in the list of sites. if blocked, redirect to blank page and if monochrome, apply filter
browser.webNavigation.onBeforeNavigate.addListener(async ({ url }) => {
  const result = await browser.storage.local.get("sites");
  const sites: Site[] = result.sites || [];
  console.log("sites on navigation", sites);

  const site = sites.find((site) => url.includes(site.url));

  if (site) {
    if (site.block) {
      browser.tabs.update({ url: "about:blank" });
    } else if (site.monochrome) {
      browser.tabs.insertCSS({ file: "monochrome.css" });
    }
  }
});
