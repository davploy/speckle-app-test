<template lang="html">
  <WelcomeView v-if="!store.isAuthenticated" />
  <v-container v-else class="home pa-6">
    <stream-search @selected="handleStreamSelection" />
    <h2 class="pt-6 primary--text">
      <span v-if="selectedStream">
        {{ selectedStream.name }} — {{ selectedStream.id }}
        <v-btn outlined text small class="ml-3" :href="serverUrl + '/streams/' + selectedStream.id">
          View in server
        </v-btn>
        <v-btn outlined text small class="ml-3" color="error" @click="store.clearStreamSelection()">
          Clear selection
        </v-btn>
      </span>
      <span v-else>
        <em>No stream selected. Find one using the search bar 👆🏼</em>
      </span>
    </h2>
  </v-container>
</template>

<script setup>
import { computed } from 'vue';
import { useSpeckleStore } from '@/stores/index'; // Adjust the store path as necessary

import StreamSearch from "@/components/StreamSearch.vue";
import WelcomeView from "@/components/WelcomeView.vue";

// Pinia store
const store = useSpeckleStore();

// Server URL (environment variable)
const serverUrl = import.meta.env.VUE_APP_SERVER_URL;

// Computed properties
const selectedStream = computed(() => {
  return store.currentStream
})

function handleStreamSelection(event) {
  console.log(event.value)
  store.handleStreamSelection(event)
}

</script>
