import { defineStore } from 'pinia';
import {
    APP_NAME,
    exchangeAccessCode,
    getStreamCommits,
    getUserData,
    goToSpeckleAuthPage,
    speckleLogOut,
} from "@/speckleUtils";


export const useSpeckleStore = defineStore('speckleStore', {
    // State is defined as a function returning an object
    // State is now a function returning an object
    state: () => ({
        user: null,
        serverInfo: null,
        currentStream: null,
        latestCommits: null,
        previousCursors: [null],
        tableOptions: null,
    }),

    // Getters remain similar
    getters: {
        isAuthenticated: (state) => state.user != null,
    },

    // Actions replace both mutations and actions from Vuex
    actions: {
        // State modification methods (formerly mutations)
        setUser(user) {
            this.user = user;
        },
        setServerInfo(info) {
            this.serverInfo = info;
        },
        setCurrentStream(stream) {
            this.currentStream = stream;
        },
        setCommits(commits) {
            this.latestCommits = commits;
        },
        setTableOptions(options) {
            this.tableOptions = options;
        },
        resetPrevCursors() {
            this.previousCursors = [null];
        },
        addCursorToPreviousList(cursor) {
            this.previousCursors.push(cursor);
        },

        // Actions (formerly Vuex actions)
        logout() {
            // Wipe the state
            this.setUser(null);
            this.setServerInfo(null);
            this.setCurrentStream(null);
            this.setCommits(null);
            this.setTableOptions(null);
            this.resetPrevCursors();
            // Wipe the tokens
            speckleLogOut();
        },
        exchangeAccessCode(accessCode) {
            // Here, we could save the tokens to the store if necessary.
            return exchangeAccessCode(accessCode);
        },
        async getUser() {
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
        async handleStreamSelection(stream) {
            this.setCurrentStream(stream);
            this.setTableOptions({ itemsPerPage: 5 });
            this.resetPrevCursors();
            const json = await getStreamCommits(stream.id, 5, null);
            this.setCommits(json.data.stream.commits);
        },
        async getCommits(cursor) {
            const json = await getStreamCommits(this.currentStream.id, 5, cursor);
            this.setCommits(json.data.stream.commits);
        },
        clearStreamSelection() {
            this.setCurrentStream(null);
            this.setCommits(null);
            this.setTableOptions(null);
            this.resetPrevCursors();
        },
    },

    // Persistence configuration
    persist: {
        key: `${APP_NAME}.vuex`,
        storage: window.localStorage,
    },

});
