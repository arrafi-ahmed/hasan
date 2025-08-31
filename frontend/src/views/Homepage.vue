<script setup>
import { appInfo, getApiPublicImgUrl, getClientPublicImageUrl } from '@/others/util'
import { computed, onMounted, reactive, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Attendee, Registration } from '@/models/index.js'

const { xs } = useDisplay()
const store = useStore()
const router = useRouter()
const route = useRoute()

// Hero background style with event banner or fallback
const heroBackgroundStyle = computed(() => {
  return {
    background: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat`,
  }
})
</script>

<template>
  <!-- Hero Section -->
  <section id="hero" class="hero-section">
    <div :style="heroBackgroundStyle" class="hero-bg">
      <div class="hero-overlay" />
      <v-container
        class="fluid fill-height d-flex flex-column justify-center align-center text-center"
      >
        <div class="hero-content-vertical-center">
          <!-- <v-img src="/img/logo.webp" alt="Peaceism Logo" max-width="160" class="mb-6 mx-auto"
              style="z-index:4; position:relative;" /> -->
          <transition name="fade-slide">
            <div>
              <h1 class="display-2 font-weight-bold mb-4 text-white text-shadow">
                {{ appInfo.name }}
              </h1>
              <p class="headline mb-8 text-white text-shadow">
                Register all the events from {{ appInfo.name }} here.
              </p>
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
        <path d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z" fill="#D4AF37" />
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
  transition:
    transform 0.3s cubic-bezier(0.4, 2, 0.6, 1),
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
  transition:
    transform 0.3s cubic-bezier(0.4, 2, 0.6, 1),
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
