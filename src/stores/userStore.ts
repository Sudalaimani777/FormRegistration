import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserProfile, Gender } from '@/types/user';

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<UserProfile[]>([]);
  const currentUser = ref<UserProfile | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const getUserById = computed(() => {
    return (id: string) => users.value.find(user => user.id === id);
  });

  const getUserByEmail = computed(() => {
    return (email: string) => users.value.find(user => user.email.toLowerCase() === email.toLowerCase());
  });

  const isEmailUnique = computed(() => {
    return (email: string, excludeId?: string) => {
      return !users.value.some(user => 
        user.email.toLowerCase() === email.toLowerCase() && user.id !== excludeId
      );
    };
  });

  // Actions
  const loadUsersFromStorage = () => {
    try {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        users.value = parsedUsers.map((user: any) => ({
          ...user,
          // Ensure backward compatibility for region field
          region: user.region || 'india',
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        }));
      }
    } catch (err) {
      console.error('Error loading users from storage:', err);
      error.value = 'Failed to load users from storage';
    }
  };

  const saveUsersToStorage = () => {
    try {
      localStorage.setItem('users', JSON.stringify(users.value));
    } catch (err) {
      console.error('Error saving users to storage:', err);
      error.value = 'Failed to save users to storage';
    }
  };

  const createUser = (userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Check if email already exists
      if (!isEmailUnique.value(userData.email)) {
        throw new Error('Email already exists');
      }

      const newUser: UserProfile = {
        ...userData,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      users.value.push(newUser);
      saveUsersToStorage();
      currentUser.value = newUser;
      
      return newUser;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create user';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUser = (id: string, updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>) => {
    try {
      isLoading.value = true;
      error.value = null;

      const userIndex = users.value.findIndex(user => user.id === id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Check if email is being changed and if it's unique
      if (updates.email && !isEmailUnique.value(updates.email, id)) {
        throw new Error('Email already exists');
      }

      const updatedUser: UserProfile = {
        ...users.value[userIndex],
        ...updates,
        updatedAt: new Date()
      };

      users.value[userIndex] = updatedUser;
      saveUsersToStorage();
      
      if (currentUser.value?.id === id) {
        currentUser.value = updatedUser;
      }

      return updatedUser;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update user';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteUser = (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const userIndex = users.value.findIndex(user => user.id === id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users.value.splice(userIndex, 1);
      saveUsersToStorage();
      
      if (currentUser.value?.id === id) {
        currentUser.value = null;
      }

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete user';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const setCurrentUser = (user: UserProfile | null) => {
    currentUser.value = user;
  };

  const clearError = () => {
    error.value = null;
  };

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Initialize store
  loadUsersFromStorage();

  return {
    // State
    users,
    currentUser,
    isLoading,
    error,
    
    // Getters
    getUserById,
    getUserByEmail,
    isEmailUnique,
    
    // Actions
    createUser,
    updateUser,
    deleteUser,
    setCurrentUser,
    clearError,
    loadUsersFromStorage,
    saveUsersToStorage
  };
});
