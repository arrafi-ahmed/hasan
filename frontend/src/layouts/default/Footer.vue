<script setup>
import {useStore} from 'vuex'
import {appInfo} from "@/others/util.js";
import {computed, onMounted} from "vue";
import {useRouter} from "vue-router";

const store = useStore()
const router = useRouter()

const event = computed(() => store.state.event.event)

onMounted(async () => {
  await store.dispatch('event/getFirstEvent')
  console.log(router.currentRoute.value.name)
})
</script>
<template>
  <v-footer class="flex-grow-0 footer bg-primary">
    <v-row
      class="justify-center align-center"
      no-gutters
    >
      <v-col
        cols="auto"
      >
        <p class="text-white mb-0">
          © {{ new Date().getFullYear() }} {{ appInfo.name }}. All rights reserved.
        </p>
      </v-col>
    </v-row>
  </v-footer>
</template>

<style scoped>
.footer-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}
</style>
