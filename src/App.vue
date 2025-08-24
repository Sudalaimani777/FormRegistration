<template>
  <v-app>
    <!-- Navigation Header -->
    <v-app-bar app color="primary" dark elevation="4">
      <v-app-bar-nav-icon v-if="smAndDown" @click="drawer = !drawer" />
      
      <v-app-bar-title class="d-flex align-center">
        <v-icon size="32" class="mr-3">mdi-account-multiple</v-icon>
        User Registration System
      </v-app-bar-title>
      
      <v-spacer />
      
      <div class="d-none d-md-flex">
        <v-btn
          v-for="item in navigationItems"
          :key="item.title"
          :to="item.path"
          variant="text"
          class="mx-2"
          :prepend-icon="item.icon"
        >
          {{ item.title }}
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Navigation Drawer (mobile only) -->
    <v-navigation-drawer
      v-if="smAndDown"
      v-model="drawer"
      app
      temporary
    >
      <v-list>
        <v-list-item
          v-for="item in navigationItems"
          :key="item.title"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
          @click="drawer = false"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <v-footer app color="grey-darken-3" dark class="text-center">
      <v-container>
        <div class="d-flex align-center justify-center">
          <v-icon size="20" class="mr-2">mdi-heart</v-icon>
          <span class="text-body-2">
            © {{ new Date().getFullYear() }} User Registration System. 
            Built with Vue 3, Pinia, Vuetify, and TypeScript.
          </span>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

// Navigation state
const drawer = ref(false);
const { smAndDown } = useDisplay();

// Navigation items
const navigationItems = [
  {
    title: 'Registration',
    path: '/',
    icon: 'mdi-account-plus'
  },
  {
    title: 'User Management',
    path: '/users',
    icon: 'mdi-account-group'
  }
];
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}

.v-main {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.v-app-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.v-footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
}

.v-icon {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}
</style>
