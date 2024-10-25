<template lang="html">
  <WelcomeView v-if="store.Authenticated" />
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

    <div class="pt-6">
      <v-select v-model="selectedKeys" :items="availableKeys" chips label="Select data to display" multiple></v-select>
      <h3 class="pa-2 primary--text">Stream commits:</h3>
      <v-data-table :loading="loading" :headers="filteredHeaders" :items="commits ? commits.items : []"
        :items-length="commits ? commits.totalCount : null" v-model:page="options.page"
        v-model:items-per-page="options.itemsPerPage" class="elevation-1"></v-data-table>
    </div>
  </v-container>
</template>


<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useSpeckleStore } from '@/stores/index'; // Adjust the store path as necessary

import StreamSearch from "@/components/StreamSearch.vue";
import WelcomeView from "@/components/WelcomeView.vue";

// Pinia store
const store = useSpeckleStore();

// Server URL (environment variable)
const serverUrl = import.meta.env.VUE_APP_SERVER_URL;

const loading = ref(false)
const options = reactive({ itemsPerPage: 5 })

const selectedKeys = ref(["id", "message", "branchName", "authorName"])

onMounted(() => {
  const storedOpts = store.tableOptions;
  if (storedOpts) Object.assign(options, storedOpts);
});

// Computed properties
const selectedStream = computed(() => {
  return store.currentStream
})


const commits = computed(() => store.latestCommits);

const previousCursors = computed(() => store.previousCursors || [null]);

const availableKeys = computed(() => {
  const keys = {};
  commits.value?.items.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      if (!keys[key]) {
        keys[key] = true;
      }
    });
  });
  return Object.keys(keys);
});

const filteredHeaders = computed(() => {
  return selectedKeys.value.map((key) => {
    return {
      title: key,
      key: key,
    };
  });
})

watch(
  options,
  async (val, oldval) => {
    store.setTableOptions(val);
    if (oldval.page && val.page !== oldval.page) {
      loading.value = true;
      if (val.page > oldval.page) {
        const cursor = store.latestCommits.cursor;
        await store.getCommits(cursor);
        store.addCursorToPreviousList(cursor);
      } else {
        console.log('page down');
        await store.getCommits(previousCursors.value[val.page - 1]);
      }
      loading.value = false;
    }
  },
  { deep: true }
);


function handleStreamSelection(event) {
  store.handleStreamSelection(event)

}




</script>
