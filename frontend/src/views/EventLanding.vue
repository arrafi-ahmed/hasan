<script setup>
import {getApiPublicImgUrl, getClientPublicImageUrl} from '@/others/util'
import {computed, onMounted, reactive, ref} from 'vue'
import {useDisplay} from 'vuetify'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import {toast} from 'vue-sonner'
import {Attendee, Registration} from "@/models/index.js";

const {xs} = useDisplay()
const store = useStore()
const router = useRouter()
const route = useRoute()

// Event and Club data - using computed properties for reactive state
const isLoading = ref(true)
const event = computed(() => store.state.event.event)

// Get event ID or slug from route
const eventSlug = computed(() => route.params.slug || null)

// Hero background style with event banner or fallback
const heroBackgroundStyle = computed(() => {
  if (event.value?.banner) {
    return {
      background: `url('${getApiPublicImgUrl(event.value.banner, 'event-banner')}') center/cover no-repeat`,
    }
  }
  return {
    background: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat`,
  }
})

const scrollTo = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({behavior: 'smooth'})
  }
}

const attendeeInit = ref({
  firstName: null,
  lastName: null,
  email: null,
  phone: null,
  isPrimary: true
})
const registrationInit = ref({
  organization: null,
  sector: null,
  expectation: null,
})

const attendee = reactive({
  ...new Attendee({...attendeeInit.value}),
})

const registration = reactive({
  ...new Registration({additionalFields: {...registrationInit.value}}),
})

const isProcessingPayment = ref(false)

const submitRegistration = async () => {
  isProcessingPayment.value = true

  try {
    // Ensure we have event and club data, use defaults if not available
    registration.eventId = event.value?.id || 1
    localStorage.setItem('registrationData', JSON.stringify(registration))
    localStorage.setItem('attendeesData', JSON.stringify([attendee]))


    // Redirect to tickets page using Vue Router
    // Only slug-based routing
    if (event.value?.slug) {
      router.push({
        name: 'tickets-slug',
        params: {
          slug: event.value.slug,
        },
      })
    } else {
      // No slug available, redirect to homepage
      console.error('No event slug available')
      toast.error('Event information not available. Please try again.')
    }
  } catch (error) {
    console.error('Registration error:', error)
    toast.error('Registration failed. Please try again.')
  } finally {
    isProcessingPayment.value = false
  }
}

// Fetch event and club data
const fetchEventData = async () => {
  try {
    isLoading.value = true

    // Try to fetch by slug first if available
    if (eventSlug.value) {
      try {
        await store.dispatch('event/setEventBySlug', {slug: eventSlug.value})
        // Check if event was found
        if (!event.value || !event.value.id) {
          router.push({
            name: 'not-found',
            params: {status: 404, message: "Event not found!"}
          })
          return
        }
      } catch (slugError) {
        console.warn('Failed to fetch event by slug:', slugError)
        router.push({
          name: 'not-found',
          params: {status: 404, message: "Event not found!"}
        })
        return
      }
    }
  } catch (error) {
    console.error('Error fetching event and club data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEventData()
})
</script>

<template>
  <!-- Hero Section -->
  <section
    id="hero"
    class="hero-section"
  >
    <div
      :style="heroBackgroundStyle"
      class="hero-bg"
    >
      <div class="hero-overlay" />
      <v-container class="fill-height d-flex flex-column justify-center align-center text-center">
        <div class="hero-content-vertical-center">
          <!-- <v-img src="/img/logo.webp" alt="Peaceism Logo" max-width="160" class="mb-6 mx-auto"
              style="z-index:4; position:relative;" /> -->
          <transition name="fade-slide">
            <div>
              <h1 class="display-2 font-weight-bold mb-4 text-white text-shadow">
                {{
                  event?.name
                }}
              </h1>
              <v-btn
                class="elevation-10"
                color="primary"
                size="x-large"
                @click="scrollTo('register')"
              >
                Register Now
              </v-btn>
            </div>
          </transition>
        </div>
      </v-container>
    </div>
    <div class="hero-divider">
      <svg
        height="100"
        preserveAspectRatio="none"
        style="transform: scaleY(-1); margin-top: 32px"
        viewBox="0 0 1440 100"
        width="100%"
      >
        <path
          d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z"
          fill="#D4AF37"
        />
      </svg>
    </div>
  </section>

  <!-- Registration & CTA Section -->
  <section
    id="register"
    class="section bg-gradient section-fade"
  >
    <v-container>
      <h2 class="display-1 text-center font-weight-bold mb-6 text-white">
        Register Now
      </h2>
      <p class="text-center mb-8 text-white">
        Fill in your details to proceed to ticket selection and checkout.
      </p>
      <v-row justify="center">
        <v-col
          cols="12"
          md="8"
        >
          <v-card
            class="pa-6"
            elevation="6"
          >
            <v-card-title class="text-center py-4 bg-primary text-white font-weight-bold rounded">
              Registration Form
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="submitRegistration">
                <div style="margin-top: 24px" />
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="attendee.firstName"
                      label="First Name"
                      required
                      variant="solo"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="attendee.lastName"
                      label="Last Name"
                      required
                      variant="solo"
                    />
                  </v-col>
                </v-row>
                <v-text-field
                  v-model="attendee.email"
                  label="Email"
                  required
                  type="email"
                  variant="solo"
                />
                <v-text-field
                  v-model="attendee.phone"
                  label="Phone Number"
                  required
                  variant="solo"
                />

                <v-alert
                  v-if="isLoading"
                  class="mt-4"
                  type="info"
                >
                  Loading event information...
                </v-alert>

                <v-row
                  class="mt-4"
                  justify="center"
                >
                  <v-col cols="auto">
                    <v-btn
                      :disabled="isLoading"
                      :loading="isProcessingPayment"
                      class="mr-4"
                      color="secondary"
                      size="large"
                      type="submit"
                    >
                      {{ isProcessingPayment ? 'Processing...' : 'Continue' }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div class="section-divider">
      <svg
        height="100"
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
        width="100%"
      >
        <path
          d="M0,100 C480,0 960,100 1440,0 L1440,100 L0,100 Z"
          fill="#D4AF37"
        />
      </svg>
    </div>
  </section>

</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 60, 114, 0.35);
  z-index: 2;
}

.hero-section .v-container {
  position: relative;
  z-index: 3;
  min-height: 80vh;
}

.text-shadow {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.hero-divider {
  position: relative;
  z-index: 4;
  margin-top: 0;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;
}

.section {
  padding: 80px 0 60px 0;
  position: relative;
}

.section-divider {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 2;
  pointer-events: none;
}

.pillar-card {
  transition: transform 0.3s cubic-bezier(0.4, 2, 0.6, 1),
  box-shadow 0.3s;
  border-radius: 18px;
  background: rgb(var(--v-theme-surface));
}

.pillar-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 8px 32px rgba(30, 60, 114, 0.12);
}

.highlight-card {
  border-radius: 16px;
  min-height: 180px;
}

.outcome-card {
  border-radius: 16px;
}

.section-fade {
  animation: fadeIn 1.2s cubic-bezier(0.4, 2, 0.6, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.sticky-nav {
  position: sticky !important;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.98) !important;
  box-shadow: 0 2px 8px rgba(30, 60, 114, 0.06);
}

.footer {
  background: rgb(var(--v-theme-primary)) !important;
}

.hero-content-vertical-center {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.ecosystem-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.06);
}

.package-card {
  transition: transform 0.3s cubic-bezier(0.4, 2, 0.6, 1),
  box-shadow 0.3s;
  border-radius: 8px;
  min-height: 220px;
  cursor: pointer;
}

.package-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
}

.selected-package {
  border: 3px solid #d4af37;
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.25);
}

.schedule-popup {
  border-radius: 20px;
  overflow: hidden;
}

.schedule-popup .v-card-title {
  border-radius: 20px 20px 0 0;
}

.schedule-row:hover {
  background-color: rgba(var(--v-theme-primary), 0.03);
  transition: background-color 0.2s ease;
}

.schedule-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.schedule-popup .v-table {
  border-radius: 12px;
  overflow: hidden;
}

.schedule-popup .v-table th {
  background-color: rgba(var(--v-theme-surface), 0.8);
  font-weight: 600;
  color: rgb(var(--v-theme-onSurface));
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.schedule-popup .v-table td {
  padding: 16px;
  vertical-align: middle;
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.08);
}

.schedule-popup .v-table tr:last-child td {
  border-bottom: none;
}
</style>
