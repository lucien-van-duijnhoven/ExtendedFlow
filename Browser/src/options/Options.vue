<script setup lang="ts">
import { ref } from 'vue'
import type { Site } from '~/logic/sites'
import { getSites, setSites } from '~/logic/sites'

const allSitesString = ref<string>('')

getSites().then((sites) => {
  allSitesString.value = JSON.stringify(sites)
})
const errMsg = ref<string>('')
const allSites = computed(() => {
  try {
    errMsg.value = ''
    return JSON.parse(allSitesString.value) as Site[]
  }
  catch (e) {
    errMsg.value = 'Invalid JSON'
    return null
  }
})
watch(allSites, (newVal) => {
  console.log(newVal)
})

function syncSites() {
  if (allSites.value)
    setSites(allSites.value)
  else
    console.error('Can not sync invalid sites')
}
</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <img src="/assets/icon.svg" class="icon-btn mx-2 text-2xl" alt="extension icon">
    <div>Options</div>

    <div class="flex gap-3 flex-col items-center">
      <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Config (json)</label>
      <textarea
        id="message" v-model="allSitesString" rows="4"
        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Write your json config..."
      />
      <button
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        @click="syncSites()"
      >
        Sync
      </button>
      <span class="text-red-300">{{ errMsg }}</span>
    </div>
  </main>
</template>
