import axios from 'axios'
import store from '@/store'
import {toast} from 'vue-sonner'

const $axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// List of public routes that don't require authentication
const publicRoutes = [
  '/event/getEventBySlug',
  '/event/getEvent',
  '/event/getAllEvents',
  '/club/getClub',
  '/registration/initRegistration',
  '/registration/save',
  '/registration/getRegistrationByEmail',
  '/stripe/create-payment-intent',
  '/stripe/confirm-payment',
  '/stripe/get-registration-from-payment',
  '/ticket/getTicketsByEventId',
  '/ticket/getTicketById',
  '/order/createOrder',
  '/extras/purchaseExtras',
  '/extras/getExtrasByEventId',
  '/extras/getExtrasByIds',
  '/sponsorship-package/getPackagesByEventId',
  '/info',
]

$axios.interceptors.request.use((config) => {
  store.commit('setProgress', true)

  // Check if this is a public route
  const isPublicRoute = publicRoutes.some(
    (route) => config.url === route,
  )

  // Only add Authorization header for non-public routes
  if (!isPublicRoute) {
    const token = store.getters['auth/getToken']
    if (token) {
      config.headers['Authorization'] = token
    }
  }

  return config
})

$axios.interceptors.response.use(
  (response) => {
    store.commit('setProgress', false)

    // Check if toast should be suppressed
    const suppressToast = response.config.headers['X-Suppress-Toast'] === 'true'

    let action = 'info'
    if (response.data?.msg && !suppressToast) {
      if (response.status >= 200 && response.status <= 299) {
        action = 'success'
      } else if (response.status >= 400 && response.status <= 499) {
        action = 'error'
      }
      toast[action](response.data.msg)
    }
    return response
  },
  (err) => {
    store.commit('setProgress', false)

    // Check if toast should be suppressed
    const suppressToast = err.config?.headers['X-Suppress-Toast'] === 'true'

    if (err.response?.data?.msg && !suppressToast) {
      toast.error(err.response?.data?.msg)
    }
    return Promise.reject(err)
  },
)

export default $axios
