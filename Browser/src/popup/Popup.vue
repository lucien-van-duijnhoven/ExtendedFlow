<script setup lang="ts">
import { getSite, makeSite, updateSite } from '~/logic/sites'
import type { Site } from '~/logic/sites'

// function openOptionsPage() {
//   browser.runtime.openOptionsPage()
// }

const currectSite = ref<Site>()
const currentUrl = ref<string>()
// Get the url of the tab that is currently active/open/is being viewed
browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  const url = tabs[0]?.url
  if (url) {
    currentUrl.value = url
    getSite(url).then((site) => {
      if (site)
        currectSite.value = site
      else
        currectSite.value = makeSite(url)
    })
  }
})

function toggleMonochrome() {
  if (currectSite.value) {
    currectSite.value.monochrome = !currectSite.value.monochrome
    updateSite(currectSite.value)
  }
}

function toggleBlock() {
  if (currectSite.value) {
    currectSite.value.block = !currectSite.value.block
    updateSite(currectSite.value)
  }
}

const seletedButtonStyle = 'bg-blue-500 text-white'
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    current page: <br><span class="font-bold">{{ currentUrl }}</span>
    <div>
      <button :class="currectSite?.monochrome && seletedButtonStyle" class="border p-5" @click="toggleMonochrome">
        Monochrome
      </button>
      <button :class="currectSite?.block && seletedButtonStyle" class="border p-5" @click="toggleBlock">
        Block
      </button>
    </div>
  </main>
</template>
