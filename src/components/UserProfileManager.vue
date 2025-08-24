<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" xl="12" lg="11" md="12">
        <!-- Header Section with Gradient Background -->
        <v-card class="mb-6 gradient-header elevation-12" rounded="xl">
          <v-card-text class="pa-8 text-center">
            <div class="d-flex align-center justify-center mb-4">
              <v-icon size="64" color="white" class="mr-4">mdi-account-group</v-icon>
              <div>
                <h1 class="text-h3 font-weight-bold white--text mb-2">User Profile Management</h1>
                <p class="text-h6 white--text opacity-80">Manage and monitor your user community</p>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Statistics Cards with Enhanced Design -->
        <v-row class="mb-8">
          <v-col cols="12" sm="6" md="3">
            <v-card class="stat-card total-users elevation-8" rounded="xl">
              <v-card-text class="pa-6 text-center">
                <div class="stat-icon-wrapper mb-4">
                  <v-icon size="56" color="white">mdi-account-multiple</v-icon>
                </div>
                <div class="text-h3 font-weight-bold primary--text mb-2">{{ userStore.users.length }}</div>
                <div class="text-subtitle-1 text-medium-emphasis">Total Users</div>
                <v-progress-linear
                  :model-value="100"
                  color="primary"
                  height="4"
                  class="mt-3"
                  rounded
                ></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card class="stat-card active-users elevation-8" rounded="xl">
              <v-card-text class="pa-6 text-center">
                <div class="stat-icon-wrapper mb-4">
                  <v-icon size="56" color="white">mdi-account-check</v-icon>
                </div>
                <div class="text-h3 font-weight-bold success--text mb-2">{{ activeUsersCount }}</div>
                <div class="text-subtitle-1 text-medium-emphasis">Active Users</div>
                <v-progress-linear
                  :model-value="(activeUsersCount / Math.max(userStore.users.length, 1)) * 100"
                  color="success"
                  height="4"
                  class="mt-3"
                  rounded
                ></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card class="stat-card average-age elevation-8" rounded="xl">
              <v-card-text class="pa-6 text-center">
                <div class="stat-icon-wrapper mb-4">
                  <v-icon size="56" color="white">mdi-chart-line</v-icon>
                </div>
                <div class="text-h3 font-weight-bold info--text mb-2">{{ averageAge }}</div>
                <div class="text-subtitle-1 text-medium-emphasis">Average Age</div>
                <v-progress-linear
                  :model-value="(averageAge / 120) * 100"
                  color="info"
                  height="4"
                  class="mt-3"
                  rounded
                ></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card class="stat-card new-users elevation-8" rounded="xl">
              <v-card-text class="pa-6 text-center">
                <div class="stat-icon-wrapper mb-4">
                  <v-icon size="56" color="white">mdi-account-plus</v-icon>
                </div>
                <div class="text-h3 font-weight-bold warning--text mb-2">{{ recentUsersCount }}</div>
                <div class="text-subtitle-1 text-medium-emphasis">New This Week</div>
                <v-progress-linear
                  :model-value="(recentUsersCount / Math.max(userStore.users.length, 1)) * 100"
                  color="warning"
                  height="4"
                  class="mt-3"
                  rounded
                ></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Main Content Card -->
        <v-card class="elevation-8" rounded="xl">
          <v-card-text class="pa-6">
            <!-- Search and Filter Section -->
            <v-row class="mb-6">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchQuery"
                  label="Search Users"
                  placeholder="Search by name, email, or phone"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  clearable
                  density="compact"
                  @input="filterUsers"
                  class="search-field"
                />
              </v-col>
              
              <v-col cols="12" md="3">
                <v-select
                  v-model="genderFilter"
                  label="Filter by Gender"
                  :items="genderFilterOptions"
                  prepend-inner-icon="mdi-gender-male-female"
                  variant="outlined"
                  clearable
                  density="compact"
                  @update:model-value="filterUsers"
                  class="filter-field"
                />
              </v-col>
              
              <v-col cols="12" md="3">
                <v-select
                  v-model="ageRangeFilter"
                  label="Filter by Age"
                  :items="ageRangeOptions"
                  prepend-inner-icon="mdi-calendar-range"
                  variant="outlined"
                  clearable
                  density="compact"
                  @update:model-value="filterUsers"
                  class="filter-field"
                />
              </v-col>
            </v-row>

            <!-- Users Table -->
            <v-data-table
              :headers="tableHeadersResponsive"
              :items="filteredUsers"
              :loading="userStore.isLoading"
              :search="searchQuery"
              class="users-table elevation-2"
              density="compact"
              :items-per-page="10"
              :items-per-page-options="[5, 10, 25, 50]"
              rounded="lg"
            >
              <!-- Custom column templates -->
              <template v-slot:item.fullName="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="32" color="primary" class="mr-3">
                    <span class="white--text font-weight-bold">
                      {{ getInitials(item.fullName) }}
                    </span>
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold">{{ item.fullName }}</div>
                    <div class="text-caption text-grey">{{ item.email }}</div>
                  </div>
                </div>
              </template>

              <template v-slot:item.age="{ item }">
                <v-chip
                  :color="getAgeColor(item.age)"
                  size="small"
                  variant="outlined"
                  prepend-icon="mdi-calendar"
                >
                  {{ item.age }} years
                </v-chip>
              </template>

              <template v-slot:item.gender="{ item }">
                <v-chip
                  :color="getGenderColor(item.gender)"
                  size="small"
                  variant="outlined"
                  prepend-icon="mdi-gender-male-female"
                >
                  {{ formatGender(item.gender) }}
                </v-chip>
              </template>

              <template v-slot:item.phoneNumber="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="small" class="mr-2" color="info">mdi-phone</v-icon>
                  <div>
                    <div>{{ formatPhoneNumber(item.phoneNumber, getSafeRegion(item.region)) }}</div>
                    <div class="text-caption text-grey">{{ getRegionDisplayName(item.region) }}</div>
                  </div>
                </div>
              </template>

              <template v-slot:item.createdAt="{ item }">
                <div class="text-caption d-flex align-center">
                  <v-icon size="small" class="mr-1" color="success">mdi-calendar-plus</v-icon>
                  {{ formatDate(item.createdAt) }}
                </div>
              </template>

              <template v-slot:item.actions="{ item }">
                <div class="d-flex flex-wrap gap-2">
                  <v-btn
                    color="primary"
                    size="small"
                    variant="outlined"
                    @click="editUser(item)"
                    prepend-icon="mdi-pencil"
                    class="action-btn"
                  >
                    Edit
                  </v-btn>
                  
                  <v-btn
                    color="error"
                    size="small"
                    variant="outlined"
                    @click="confirmDeleteUser(item)"
                    prepend-icon="mdi-delete"
                    class="action-btn"
                  >
                    Delete
                  </v-btn>
                  
                  <v-btn
                    color="info"
                    size="small"
                    variant="outlined"
                    @click="viewUserDetails(item)"
                    prepend-icon="mdi-eye"
                    class="action-btn"
                  >
                    View
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <!-- User Details Dialog -->
        <v-dialog v-model="showUserDetails" max-width="600">
          <v-card v-if="selectedUser">
            <v-card-title class="text-h5 primary--text pa-6">
              <v-icon size="32" class="mr-3">mdi-account-details</v-icon>
              User Profile Details
            </v-card-title>
            
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" class="text-center mb-4">
                  <v-avatar size="80" color="primary">
                    <span class="white--text text-h4 font-weight-bold">
                      {{ getInitials(selectedUser.fullName) }}
                    </span>
                  </v-avatar>
                  <div class="text-h5 font-weight-bold mt-3">{{ selectedUser.fullName }}</div>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-list>
                    <v-list-item prepend-icon="mdi-calendar" color="primary">
                      <v-list-item-title>Age</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedUser.age }} years old</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item prepend-icon="mdi-gender-male-female" color="info">
                      <v-list-item-title>Gender</v-list-item-title>
                      <v-list-item-subtitle>{{ formatGender(selectedUser.gender) }}</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item prepend-icon="mdi-phone" color="success">
                      <v-list-item-title>Phone</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ formatPhoneNumber(selectedUser.phoneNumber, getSafeRegion(selectedUser.region)) }}
                        <div class="text-caption text-grey mt-1">
                          {{ getRegionDisplayName(selectedUser.region) }}
                        </div>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-list>
                    <v-list-item prepend-icon="mdi-email" color="warning">
                      <v-list-item-title>Email</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedUser.email }}</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item prepend-icon="mdi-calendar-plus" color="success">
                      <v-list-item-title>Member Since</v-list-item-title>
                      <v-list-item-subtitle>{{ formatDate(selectedUser.createdAt) }}</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item prepend-icon="mdi-calendar-edit" color="info">
                      <v-list-item-title>Last Updated</v-list-item-title>
                      <v-list-item-subtitle>{{ formatDate(selectedUser.updatedAt) }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
            
            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn
                color="primary"
                @click="editUser(selectedUser)"
                prepend-icon="mdi-pencil"
              >
                Edit Profile
              </v-btn>
              <v-btn
                color="secondary"
                variant="outlined"
                @click="showUserDetails = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Edit User Dialog -->
        <v-dialog v-model="showEditDialog" :max-width="smAndDown ? '95%' : '900'" persistent>
          <v-card class="edit-dialog-card">
            <v-card-title class="text-h5 primary--text pa-6 edit-dialog-header">
              <div class="d-flex align-center">
                <v-icon size="32" class="mr-3">mdi-account-edit</v-icon>
                <div>
                  <div class="text-h5 font-weight-bold">Edit User Profile</div>
                  <div class="text-subtitle-2 text-medium-emphasis mt-1">
                    Update user information and settings
                  </div>
                </div>
              </div>
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                @click="closeEditDialog"
                class="close-btn"
              />
            </v-card-title>
            
            <v-card-text class="pa-0">
              <div class="edit-form-container">
                <UserRegistrationForm
                  :user="userToEdit"
                  :is-editing="true"
                  @user-updated="handleUserUpdated"
                  @form-reset="closeEditDialog"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="showDeleteDialog" max-width="400">
          <v-card>
            <v-card-title class="text-h6 error--text pa-6">
              <v-icon size="32" class="mr-3">mdi-alert-circle</v-icon>
              Confirm Deletion
            </v-card-title>
            
            <v-card-text class="pa-6">
              <p>Are you sure you want to delete the user profile for <strong>{{ userToDelete?.fullName }}</strong>?</p>
              <p class="text-caption text-grey mt-2">This action cannot be undone.</p>
            </v-card-text>
            
            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn
                color="secondary"
                variant="outlined"
                @click="showDeleteDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="error"
                @click="deleteUser"
                :loading="userStore.isLoading"
                prepend-icon="mdi-delete"
              >
                Delete User
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import UserRegistrationForm from './UserRegistrationForm.vue';
import type { UserProfile, Gender, PhoneRegion } from '@/types/user';
import { useDisplay } from 'vuetify';
import { ValidationService } from '@/utils/validation';

// Store
const userStore = useUserStore();

// Display (responsive)
const { smAndDown } = useDisplay();

// Reactive data
const searchQuery = ref('');
const genderFilter = ref<Gender | ''>('');
const ageRangeFilter = ref<string>('');
const showUserDetails = ref(false);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedUser = ref<UserProfile | null>(null);
const userToEdit = ref<UserProfile | undefined>(undefined);
const userToDelete = ref<UserProfile | null>(null);

// Computed properties
const activeUsersCount = computed(() => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return userStore.users.filter(user => new Date(user.updatedAt) > oneWeekAgo).length;
});

const averageAge = computed(() => {
  if (userStore.users.length === 0) return 0;
  const totalAge = userStore.users.reduce((sum, user) => sum + user.age, 0);
  return Math.round(totalAge / userStore.users.length);
});

const recentUsersCount = computed(() => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return userStore.users.filter(user => new Date(user.createdAt) > oneWeekAgo).length;
});

const filteredUsers = computed(() => {
  let users = userStore.users;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    users = users.filter(user => 
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phoneNumber.includes(query)
    );
  }
  
  if (genderFilter.value) {
    users = users.filter(user => user.gender === genderFilter.value);
  }
  
  if (ageRangeFilter.value) {
    const [min, max] = ageRangeFilter.value.split('-').map(Number);
    users = users.filter(user => user.age >= min && user.age <= max);
  }
  
  return users;
});

// Table headers (desktop)
type TableHeader = { title: string; key: string; sortable: boolean; align?: 'start' | 'center' | 'end' };
const tableHeaders = [
  { title: 'User', key: 'fullName', sortable: true },
  { title: 'Age', key: 'age', sortable: true, align: 'center' },
  { title: 'Gender', key: 'gender', sortable: true, align: 'center' },
  { title: 'Phone', key: 'phoneNumber', sortable: false },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Member Since', key: 'createdAt', sortable: true, align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' }
] satisfies readonly TableHeader[];

// Table headers (responsive)
const tableHeadersResponsive = computed(() => {
  if (smAndDown.value) {
    return [
      { title: 'User', key: 'fullName', sortable: true },
      { title: 'Email', key: 'email', sortable: true },
      { title: 'Actions', key: 'actions', sortable: false, align: 'center' }
    ] satisfies readonly TableHeader[];
  }
  return tableHeaders;
});

// Filter options
const genderFilterOptions = [
  { title: 'Male', value: 'male' },
  { title: 'Female', value: 'female' },
  { title: 'Non-binary', value: 'non-binary' },
  { title: 'Prefer not to say', value: 'prefer-not-to-say' },
  { title: 'Other', value: 'other' }
];

const ageRangeOptions = [
  { title: '13-17 years', value: '13-17' },
  { title: '18-25 years', value: '18-25' },
  { title: '26-35 years', value: '26-35' },
  { title: '36-50 years', value: '36-50' },
  { title: '51+ years', value: '51-120' }
];

// Methods
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAgeColor = (age: number): string => {
  if (age < 18) return 'warning';
  if (age < 30) return 'success';
  if (age < 50) return 'info';
  return 'secondary';
};

const getGenderColor = (gender: Gender): string => {
  const colors: Record<Gender, string> = {
    male: 'blue',
    female: 'pink',
    'non-binary': 'purple',
    'prefer-not-to-say': 'grey',
    other: 'orange'
  };
  return colors[gender];
};

const formatGender = (gender: Gender): string => {
  const labels: Record<Gender, string> = {
    male: 'Male',
    female: 'Female',
    'non-binary': 'Non-binary',
    'prefer-not-to-say': 'Prefer not to say',
    other: 'Other'
  };
  return labels[gender];
};

const formatPhoneNumber = (phone: string, region: PhoneRegion | null | undefined): string => {
  if (!region) return phone;
  return ValidationService.formatPhoneNumber(phone, region);
};

const getRegionDisplayName = (region: PhoneRegion | null | undefined): string => {
  if (!region) return 'Unknown Region';
  const regionInfo = ValidationService.getPhoneRegionInfo(region);
  return `${regionInfo.flag} ${regionInfo.name}`;
};

const getSafeRegion = (region: PhoneRegion | null | undefined): PhoneRegion => {
  // If region is undefined, null, or empty string, default to 'india'
  if (!region || region === '') {
    return 'india';
  }
  
  // Validate that the region is a valid PhoneRegion
  const validRegions: PhoneRegion[] = ['india', 'usa', 'uk', 'canada', 'australia', 'germany', 'france', 'japan', 'china', 'brazil', 'other'];
  if (validRegions.includes(region)) {
    return region;
  }
  
  // Fallback to 'india' if region is invalid
  return 'india';
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

const filterUsers = () => {
  // Trigger recompute
};

const viewUserDetails = (user: UserProfile) => {
  selectedUser.value = user;
  showUserDetails.value = true;
};

const editUser = (user: UserProfile) => {
  userToEdit.value = user;
  showEditDialog.value = true;
  showUserDetails.value = false;
};

const confirmDeleteUser = (user: UserProfile) => {
  userToDelete.value = user;
  showDeleteDialog.value = true;
};

const deleteUser = async () => {
  if (!userToDelete.value) return;
  
  try {
    await userStore.deleteUser(userToDelete.value.id);
    showDeleteDialog.value = false;
    userToDelete.value = null;
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const handleUserUpdated = () => {
  showEditDialog.value = false;
  userToEdit.value = undefined;
};

const closeEditDialog = () => {
  showEditDialog.value = false;
  userToEdit.value = undefined;
};

// Lifecycle
onMounted(() => {
  userStore.loadUsersFromStorage();
});
</script>

<style scoped>
/* Gradient Header */
.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.gradient-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

/* Statistics Cards */
.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.stat-card.total-users {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.active-users {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card.average-age {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-card.new-users {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  backdrop-filter: blur(10px);
}

/* Search and Filter Fields */
.search-field, .filter-field {
  transition: all 0.3s ease;
}

.search-field:hover, .filter-field:hover {
  transform: translateY(-2px);
}

/* Users Table */
.users-table {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.users-table :deep(.v-data-table-header) {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.users-table :deep(.v-data-table-header th) {
  font-weight: 600;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.875rem;
}

.users-table :deep(.v-data-table__tr:hover) {
  background: rgba(102, 126, 234, 0.05);
}

/* Action Buttons */
.action-btn {
  transition: all 0.3s ease;
  border-radius: 8px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.3px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* Chips */
.v-chip {
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.v-chip:hover {
  transform: scale(1.05);
}

/* Avatar */
.v-avatar {
  border: 2px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.v-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* List Items */
.v-list-item {
  padding: 12px 0;
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .stat-card {
    margin-bottom: 16px;
  }
  
  .gradient-header .text-h3 {
    font-size: 2rem !important;
  }
  
  .gradient-header .text-h6 {
    font-size: 1rem !important;
  }
}

@media (max-width: 600px) {
  .gap-2 { 
    gap: 8px; 
  }
  
  .gradient-header .pa-8 {
    padding: 32px 16px !important;
  }
  
  .stat-card .pa-6 {
    padding: 24px 16px !important;
  }
  
  .stat-icon-wrapper {
    width: 60px;
    height: 60px;
  }
  
  .stat-icon-wrapper .v-icon {
    font-size: 32px !important;
  }
}

/* Smooth Animations */
.v-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom Scrollbar */
.users-table :deep(.v-data-table__wrapper)::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.users-table :deep(.v-data-table__wrapper)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.users-table :deep(.v-data-table__wrapper)::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.users-table :deep(.v-data-table__wrapper)::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Edit Dialog Styles */
.edit-dialog-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.edit-dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.edit-dialog-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.edit-dialog-header .close-btn {
  color: white;
  transition: all 0.3s ease;
}

.edit-dialog-header .close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.edit-form-container {
  max-height: 70vh;
  overflow-y: auto;
  padding: 24px;
}

.edit-form-container::-webkit-scrollbar {
  width: 8px;
}

.edit-form-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.edit-form-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.edit-form-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive Dialog */
@media (max-width: 600px) {
  .edit-dialog-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .edit-dialog-header .close-btn {
    align-self: flex-end;
  }
  
  .edit-form-container {
    padding: 16px;
    max-height: 80vh;
  }
}

/* Enhanced Mobile Responsiveness */
@media (max-width: 480px) {
  .edit-dialog-header .pa-6 {
    padding: 20px 16px !important;
  }
  
  .edit-dialog-header .text-h5 {
    font-size: 1.25rem !important;
  }
  
  .edit-dialog-header .text-subtitle-2 {
    font-size: 0.875rem !important;
  }
  
  .edit-form-container {
    padding: 12px;
    max-height: 85vh;
  }
}

/* Better Dialog Animation */
.edit-dialog-card {
  animation: dialogSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Improved Dialog Header Layout */
.edit-dialog-header {
  position: relative;
  z-index: 1;
}

.edit-dialog-header > div {
  position: relative;
  z-index: 2;
}

.edit-dialog-header .close-btn {
  position: relative;
  z-index: 2;
}

/* Better Form Container Scrolling */
.edit-form-container {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* Enhanced Close Button */
.edit-dialog-header .close-btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.edit-dialog-header .close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1) rotate(90deg);
}
</style>
