export default defineNuxtRouteMiddleware((to, from) => {
      if (process.client) {
        console.log('From auth middleware');
        if (sessionStorage.getItem("authToken")) {
          console.log('authToken is present');
        } else {

          console.log('authToken is not present');
          return navigateTo('/loginPage');
        }
      }
})