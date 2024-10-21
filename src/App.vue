<script setup>
import { ref, computed } from 'vue'
import { useSpeckleStore } from '@/stores/index' // Adjust the path as necessary

const store = useSpeckleStore()
// const isAuthenticated = ref(false)

const isAuthenticated = computed(() => {
  return store.isAuthenticated
})




</script>

<template>


  <!-- <v-img src="@/assets/img.png" alt="Speckle Image" width="200" height="200"></v-img> -->

  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img alt="Speckle Logo" class="shrink mr-2" contain src="@/assets/img.png" transition="scale-transition"
          width="40" height="24" />
        <h3>SPECKLE DEMO APP</h3>
      </div>

      <div v-if="isAuthenticated">
        Welcome
        <b>{{ store.user.name }}</b>
        ! You are connected to
        <b>
          {{ store.serverInfo.company }}'s
          <em>{{ store.serverInfo.name }}</em>
        </b>
      </div>



      <v-spacer></v-spacer>


      <v-btn outlined v-if="!isAuthenticated" @click="store.redirectToAuth">
        <span>Login with Speckle</span>
      </v-btn>
      <v-btn outlined v-else @click="store.logout">
        Log out
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>



</template>

<style scoped></style>
