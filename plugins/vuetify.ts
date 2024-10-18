import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from "vuetify";
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

const myCustomLightTheme = {
  dark: true,
  colors: {
    overlayTheme:"#000000",
    chartLine: "#5C6CFA",
    background: '#2B2F3B',
    surface: '#2E333C',
    onSurface: '#2E333C',
    primary: '#5C6CFA',    
    secondary: '#03DAC6',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    display: {
      mobileBreakpoint: 'sm',
      thresholds: {
        xs: 0,
        sm: 340,
        md: 540,
        lg: 800,
        xl: 1280,
      },
    },
    components,
    directives,
    theme: {
      defaultTheme: 'myCustomLightTheme', // Use the theme key here, not the object
      themes: {
        myCustomLightTheme,
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})