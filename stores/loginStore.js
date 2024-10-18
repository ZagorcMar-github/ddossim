import axios from 'axios';
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('loginStore', {
  state: () => ({
    ActiveSession: false,
    userId:'',
    username:'',
    country:'',
    showLoginSnackbar: false,
  }),
  getters: {
    getActiveSession: state => {
      return state.ActiveSession;
    }
  },
  mutations: {
    setActiveSession(state, payload) {
      state.ActiveSession = payload;
    }
  },
  actions: {
    async updateValue({commit}, payload) {
      let stuff = await axios.post('http://localhost:8080/api/v1/login', payload)
      commit('setActiveSession', payload);
    }
  }
})