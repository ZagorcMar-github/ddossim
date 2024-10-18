<template>
  <div>
    <v-parallax src="~/assets/city.png" class=""> </v-parallax>
    <v-dialog v-model="overlay" max-width="500" class="px-2 py-2" persistent>
      <v-card>
        <v-container>
          <v-row>
            <v-col cols="12" align="center">
              <p class="text-h2 mb-3">Register</p>
            </v-col>
            <v-col>
              {{ errorText }}
            </v-col>
          </v-row>
          <v-form ref="form">
            <v-text-field
              class="mb-2"
              :rules="requiredRule"
              v-model="firstName"
              label="First name"
            ></v-text-field>
            <v-text-field
              class="mb-2"
              :rules="requiredRule"
              v-model="lastName"
              label="Last name"
            ></v-text-field>
            <v-text-field
              class="mb-2"
              :rules="requiredRule"
              v-model="username"
              label="Username"
            ></v-text-field>
            <v-text-field
              class="mb-2"
              :rules="requiredRule"
              v-model="country"
              label="Country"
            ></v-text-field>
            <v-text-field
              class="mb-2"
              :rules="requiredRule"
              v-model="email"
              label="Email"
            ></v-text-field>
            <v-text-field
            type="password"
              class="mb-2"
              :rules="confirmPasswordRule"
              v-model="password"
              label="Password"
            ></v-text-field>
            <v-text-field
            type="password"
              class="mb-2"
              :rules="requiredRule"
              v-model="confirmPassword"
              label="Confirm password"
            ></v-text-field>

            <v-btn block :loading="btnLoading" class="custom_backdrop my-2" @click="register()">
              register</v-btn
            >
          </v-form>
          <v-btn block class="custom_backdrop mb-2" to="/">
            return to home screen</v-btn
          >
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      requiredRule: [(v) => !!v || "This field is required"],
      confirmPasswordRule: [
      (v) => !!v || "This field is required",
      (v) => v === this.confirmPassword || "Passwords must match"],
      overlay: true,
      firstName: "",
      lastName: "",
      username: "",
      country: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorText: "",
      btnLoading:false
    };
  },
  methods: {
    async register() {
        console.log("Validating form...");
        const validationResult = await this.$refs.form.validate();
  console.log("Validation Result:", validationResult);

      if (validationResult.valid) {
        let data = {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          country: this.country,
          email: this.email,
          password: this.password,
        };
        try {
          this.btnLoading=true
          let response = await axios.post("api/api/user/registerUser", data);
         
          if(response){
            this.btnLoading=false
          }
          navigateTo("/loginPage");
        } catch (error) {
          this.errorText = error.response.data;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.custom_backdrop {
  background-image: linear-gradient(to right, #8e5efa, #4970fb);
}
</style>
