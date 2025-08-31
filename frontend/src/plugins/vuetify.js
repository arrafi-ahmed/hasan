/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/styles'
import {VFileUpload} from 'vuetify/labs/VFileUpload'
import {VDateInput} from 'vuetify/labs/VDateInput'
// Composables
import {createVuetify} from 'vuetify'

// Icon sets
import {aliases, mdi} from 'vuetify/iconsets/mdi'
import {fa} from 'vuetify/iconsets/fa'

const light = {
  dark: false,
  colors: {
    // Background colors
    background: '#ffffff',
    surface: '#ffffff',
    'surface-variant': '#f8f9fa',
    header: '#ffffff',

    // Primary colors (Darker blue for better contrast)
    primary: '#5511f8',
    'on-primary': '#ffffff',

    // Secondary colors (Logo gold)
    secondary: '#D4AF37',
    'on-secondary': '#000000',

    // Accent colors (Darker purple for better contrast)
    accent: '#2a5298',
    'on-accent': '#ffffff',

    // Status colors
    success: '#27ae60',
    'on-success': '#ffffff',
    error: '#e74c3c',
    'on-error': '#ffffff',
    warning: '#f39c12',
    'on-warning': '#000000',
    info: '#3498db',
    'on-info': '#ffffff',

    // Text colors
    'on-background': '#2c3e50',
    'on-surface': '#2c3e50',
    'on-surface-variant': '#7f8c8d',

    // Outline colors
    outline: '#e9ecef',
    'outline-variant': '#bdc3c7',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VFileUpload,
    VDateInput,
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      fa,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light,
    },
  },
})
