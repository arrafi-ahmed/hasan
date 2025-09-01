<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Welcome to Binatnaa Tours</h1>
        <p class="hero-subtitle">Discover amazing tours and adventures with us</p>
        <div class="hero-actions">
          <v-btn
            class="hero-btn"
            color="primary"
            href="https://binatnaa.com/todos-viajes/"
            size="large"
            target="_blank"
          >
            View Tours
          </v-btn>
          <v-btn
            class="hero-btn"
            href="https://web.whatsapp.com/send?phone=34664219269&text="
            size="large"
            target="_blank"
            variant="outlined"
          >
            Contact Us
          </v-btn>
        </div>
      </div>
    </section>

    <!-- Info Section -->
    <section class="info-section">
      <div class="container">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon">🌍</div>
            <h3>Amazing Destinations</h3>
            <p>Explore the world with our curated tours</p>
          </div>
          <div class="info-item">
            <div class="info-icon">👨‍💼</div>
            <h3>Expert Guides</h3>
            <p>Professional and experienced tour leaders</p>
          </div>
          <div class="info-item">
            <div class="info-icon">✨</div>
            <h3>Unforgettable Experiences</h3>
            <p>Create memories that last a lifetime</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.homepage {
  min-height: 100vh;
}

.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')
      center/cover;
  color: white;
}

.hero-content {
  max-width: 800px;
  padding: 0 20px;
  z-index: 2;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  min-width: 160px;
}

.info-section {
  padding: 40px 0;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-item {
  text-align: center;
  padding: 2rem;
}

.info-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.info-item h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.info-item p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .hero-btn {
    width: 100%;
    max-width: 280px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
