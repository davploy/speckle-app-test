import { defineStore } from 'pinia';
import {
    exchangeAccessCode,
    getUserData,
    goToSpeckleAuthPage,
    speckleLogOut
} from "@/speckleUtils";


export const useSpeckleStore = defineStore('speckleStore', {
    // State is defined as a function returning an object
    state: () => ({
        user: null,
        serverInfo: null,
        currentStream: null,
    }),

    // Getters can be defined as regular functions
    getters: {
        isAuthenticated() {
            return this.user != null
        }
    },


    // Actions
    actions: {
        setUser(user) {
            console.log("setting user", user)
            this.user = user;
        },

        setServerInfo(info) {
            this.serverInfo = info;
        },
        setCurrentStream(stream) {
            this.currentStream = stream
        },

        logout() {
            // Wipe the state
            this.setUser(null);
            this.setServerInfo(null);
            // Wipe the tokens
            speckleLogOut();
        },

        async exchangeAccessCode(accessCode) {
            // You could save the tokens to the store if necessary
            return exchangeAccessCode(accessCode);
        },

        async getUser() {
            console.log("getting user...")

            try {
                const json = await getUserData();
                const data = json.data;
                this.setUser(data.user);
                this.setServerInfo(data.serverInfo);
            } catch (err) {
                console.error(err);
            }
        },

        redirectToAuth() {
            goToSpeckleAuthPage();
        },
        handleStreamSelection(stream) {
            this.currentStream = stream;
        },
        clearStreamSelection() {
            this.currentStream = null;
        },
    }

});
