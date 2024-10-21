<template>
    <v-autocomplete v-model="selectedSearchResult" :items="streams.items" v-model:search-input="search" no-filter
        counter="2" rounded filled dense flat hide-no-data hide-details placeholder="Streams Search" item-text="name"
        item-value="id" return-object clearable append-icon="" @update:search-input="debounceInput">
        <template #item="{ item }">
            <v-list-item-content>
                <v-list-item-title>
                    <v-row class="pa-0 ma-0">
                        {{ item.name }}
                        <v-spacer></v-spacer>
                        <span class="streamid">{{ item.id }}</span>
                    </v-row>
                </v-list-item-title>
                <v-list-item-subtitle class="caption">
                    Updated
                    <time-ago :datetime="item.updatedAt"></time-ago>
                </v-list-item-subtitle>
            </v-list-item-content>
        </template>
    </v-autocomplete>
</template>

<script setup>
import { ref, watch } from 'vue'
import { searchStreams } from '@/speckleUtils'
import debounce from 'lodash.debounce'
import TimeAgo from 'vue-timeago3'

// Define emit for sending events to parent
const emit = defineEmits(['selected'])

const search = ref('')
const streams = ref({ items: [] })
const selectedSearchResult = ref(null)

// Watch for changes to selectedSearchResult
watch(selectedSearchResult, (val) => {
    search.value = ''
    streams.value.items = []
    if (val) emit('selected', val)
})

// Fetch search results asynchronously
const fetchSearchResults = async (e) => {
    if (!e || e.length < 3) return
    const json = await searchStreams(e)
    streams.value = json.data.streams
}

// Debounce input handler
const debounceInput = debounce((e) => {
    console.log(e)
    fetchSearchResults(e)
}, 300)
</script>

<style scoped></style>