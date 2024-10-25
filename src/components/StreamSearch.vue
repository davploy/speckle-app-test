<template>
    <v-autocomplete v-model="selectedSearchResult" :items="streams.items" v-model:search="search" no-filter counter="2"
        filled dense flat hide-no-data hide-details placeholder="Streams Search" item-title="name" item-value="id"
        return-object clearable append-icon="" @update:search="debounceInput">


        <!-- <template v-slot:item="{ item }">
            <v-list-item>
                <v-list-item-title>
                    <v-row class="pa-0 ma-0">
                        {{ item.title }}
                        <v-spacer></v-spacer>
                        <span class="streamid">{{ item.id }}</span>
                    </v-row>
                </v-list-item-title>
                <v-list-item-subtitle class="caption">
                    Updated
                    <time-ago :datetime="item.updatedAt"></time-ago>
                </v-list-item-subtitle>
            </v-list-item>
        </template> -->


    </v-autocomplete>

    <!-- <p>{{ streams }}</p> -->

</template>

<script setup>
import { ref, watch } from 'vue'
import { searchStreams } from '@/speckleUtils'
import debounce from 'lodash.debounce'
// import TimeAgo from 'vue-timeago3'

// Define emit for sending events to parent
const emit = defineEmits(['selected'])

const search = ref('')
const streams = ref({ items: [] })
const selectedSearchResult = ref(null)


// Watch for changes to selectedSearchResult
watch(selectedSearchResult, (val) => {
    console.log(val)
    search.value = ''
    streams.value.items = []
    if (val) emit('selected', val)
})

// Fetch search results asynchronously
const fetchSearchResults = async (e) => {
    if (!e || e.length < 1) return
    const json = await searchStreams(e)
    streams.value = json.data.streams
}

// Debounce input handler
const debounceInput = debounce((e) => {
    fetchSearchResults(e)
}, 300)



</script>

<style scoped></style>