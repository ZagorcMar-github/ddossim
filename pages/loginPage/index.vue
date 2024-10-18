<template>
  <div>
    <v-parallax src="~/assets/city.png" class="">

      </v-parallax>
    <v-dialog v-model="overlay" max-width="500" class="px-2 py-2" persistent>
      <v-card>
        <v-container>
          <v-row>
            <v-col cols="12" align="center">
              <p class="text-h2 mb-3">LOGIN</p>
            </v-col>
            <v-col>
              {{ errorText }}
            </v-col>
          </v-row>
          <v-form>
            <v-text-field  v-model="username" label="Email"></v-text-field>
            <v-text-field type="password"  v-model="password" label="Password"></v-text-field>
            dont have an account yet <nuxt-link to="/register">register</nuxt-link>
            
            <v-btn block class="custom_backdrop my-2 " :loading="btnLoading" @click="logIn()">
              log in</v-btn
            >
            <v-btn block class="custom_backdrop mb-2" to="/">
              return to home screen</v-btn
            >
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState,mapWritableState } from 'pinia'
import VueJwtDecode from 'vue-jwt-decode'
import {useLoginStore } from "../../stores/loginStore";
import axios from 'axios';
export default {

  data() {
    return {
      errorText: "",
      showlogInSnackbar: false,
      overlay: true,
      username: "",
      password: "",
      btnLoading:false
    };
  },
  methods: {
    storeToken(token) {
      let store = useLoginStore();
      if (process.client) {
        console.log("came to");
        let Decodedtoken = VueJwtDecode.decode(token); 
        let userId=Decodedtoken.sub;
        let username=Decodedtoken.name;
        let country = Decodedtoken.country;
        store.userId = userId;
        store.username=username;
        store.country=country;
        sessionStorage.setItem("authToken", token);
        
      }
    },

    async logIn() {
      let requestBody = { email: this.username, password: this.password };
      try {
        let store = useLoginStore(); 
        console.log(requestBody)
        this.btnLoading=true;
        let response = await axios.post("api/api/User/logInUser", requestBody);
        console.log(response)
        this.btnLoading=false;
        this.storeToken(response.data);
        store.ActiveSession = true;
        navigateTo("/simulator")
      } catch (error) {
        console.error(error);
        if (error.response) {
          this.btnLoading=false;
          this.errorText = error.response.data;
        }
      }
    },
  },
  computed:{
  },
  mounted(){
  }
};
</script>

<style lang="scss" scoped>
.custom_backdrop {
  background-image: linear-gradient(to right, #8e5efa, #4970fb);
}</style>
