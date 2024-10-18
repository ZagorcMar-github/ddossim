<template>
  <v-layout>
    <v-navigation-drawer class="custom_backdrop" v-model="drawer" temporary>
      <v-list>
        <v-list-item v-for="item in items">
          <nuxt-link :to="item.to">{{ item.title }}</nuxt-link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app class="custom_backdrop" scroll-behavior="elevate">
      <v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>
      <v-app-bar-title class="custom_heding"
        >Martin Zagorc -Simuliranje DDoS napadov</v-app-bar-title
      >
      <v-spacer></v-spacer>
      <v-btn to="/loginPage" v-if="!ActiveSession">log in</v-btn>
      <v-btn @click="destroySession" v-else>log out</v-btn>
    </v-app-bar>

    <v-main>
    <slot />
  </v-main>
  </v-layout>
</template>

<script>
import axios from "axios";
import { useLoginStore } from "../../stores/loginStore";
import VueJwtDecode from "vue-jwt-decode";
export default {
  name: "DefaultLayout",
  data() {
    return {
      errorText: "",
      showlogInSnackbar: false,
      overlay: false,
      username: "",
      password: "",
      drawer: false,
      items: [
        {
          icon: "mdi-chart-bubble",
          title: "home",
          to: "/",
        },
        {
          icon: "mdi-apps",
          title: "Simulator",
          to: "/simulator",
        },
      ],
    };
  },
  methods: {
    destroySession() {
      let store = useLoginStore();
      if (process.client) {
        sessionStorage.removeItem("authToken");
        store.ActiveSession = false;
        
        this.showLogInSnackbar=true
        navigateTo("/");
      }
    },
    decodeToken(){
      let store = useLoginStore();
    let token = sessionStorage.getItem("authToken");
    let decodedtoken;
    if (token) {
      store.ActiveSession = true;
      console.log("came to token mountibng");
      decodedtoken = VueJwtDecode.decode(token);
      let userId = decodedtoken.sub;
      let username = decodedtoken.name;
      let country = decodedtoken.country;
      store.userId = userId;
      store.username = username;
      store.country = country;
    } else {
      console.log("no tokens");
    }
    },
  },

  computed: {
  ActiveSession() {
    let store = useLoginStore();
    let activeSession = store.ActiveSession; 
    return activeSession;
  },
},mounted(){
  console.log("mounted it")
  this.decodeToken()
}

};
</script>

<style lang="scss" scoped>
.custom_backdrop {
  background-image: linear-gradient(to right, #8e5efa, #4970fb);
}
.custom_backdrop2 {
  background-image: linear-gradient(#8e5efa, #4970fb);
}
</style>
