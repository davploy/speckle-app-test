import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueTimeago from 'vue-timeago3';
import piniaPersistedState from 'pinia-plugin-persistedstate';


import 'vuetify/styles'; // Global CSS

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPersistedState);

app.use(pinia)
app.use(router)
app.use(VueTimeago, { locale: 'en' })
app.use(vuetify)

app.mount('#app')
