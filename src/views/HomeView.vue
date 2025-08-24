<script setup lang="ts">
// import { useRouter } from 'vue-router';
import UserRegistrationForm from '@/components/UserRegistrationForm.vue';
import type { UserProfile } from '@/types/user';

// const router = useRouter();

const handleUserCreated = (user: UserProfile) => {
  console.log('User created successfully:', user);
};
</script>

<template>
  <v-container fluid class="pa-6">
    <UserRegistrationForm @user-created="handleUserCreated" />
  </v-container>
</template>

<style scoped>
</style>
