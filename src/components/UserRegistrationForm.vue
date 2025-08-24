<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" sm="11" md="10" lg="9" xl="8">
        <!-- Header Section -->
        <v-card class="mb-6 gradient-header elevation-12" rounded="xl">
          <v-card-text class="pa-8 text-center">
            <div class="d-flex align-center justify-center mb-4 flex-column flex-sm-row">
              <v-icon size="64" color="white" class="mr-0 mr-sm-4 mb-4 mb-sm-0">mdi-account-plus</v-icon>
              <div class="text-center text-sm-left">
                <h1 class="text-h3 font-weight-bold white--text mb-2">
                  {{ isEditing ? 'Edit User Profile' : 'User Registration' }}
                </h1>
                <p class="text-h6 white--text opacity-80">
                  {{ isEditing ? 'Update user information' : 'Create a new user account' }}
                </p>
              </div>
            </div>
          </v-card-text>
        </v-card>

                <!-- Form Card -->
        <v-card class="elevation-8" rounded="xl">
          <v-card-text class="pa-6">
            <v-form ref="form" v-model="isFormValid" @submit.prevent="handleSubmit">
              <!-- Personal Information Section -->
              <v-expansion-panels v-model="activePanel" multiple class="form-sections">
                <v-expansion-panel class="form-section-panel" :class="{ 'editing-mode': isEditing }">
                  <v-expansion-panel-title class="form-section-title">
                    <div class="d-flex align-center">
                      <v-icon class="mr-3" color="primary">mdi-account-circle</v-icon>
                      <span class="font-weight-bold">Personal Information</span>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="form-section-content">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="formData.fullName"
                          :density="fieldDensity"
                          label="Full Name *"
                          placeholder="Enter your full name"
                          :rules="[rules.required, rules.fullName]"
                          :error-messages="errors.fullName"
                          @blur="validateField('fullName')"
                          prepend-inner-icon="mdi-account"
                          variant="outlined"
                          clearable
                          class="form-field"
                        />
                      </v-col>
                      
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model.number="formData.age"
                          :density="fieldDensity"
                          label="Age *"
                          placeholder="Enter your age"
                          type="number"
                          :rules="[rules.required, rules.age]"
                          :error-messages="errors.age"
                          @blur="validateField('age')"
                          prepend-inner-icon="mdi-calendar"
                          variant="outlined"
                          min="13"
                          max="120"
                          class="form-field"
                        />
                      </v-col>
                      
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="formData.gender"
                          :density="fieldDensity"
                          label="Gender *"
                          :items="genderOptions"
                          :rules="[rules.required]"
                          :error-messages="errors.gender"
                          @blur="validateField('gender')"
                          prepend-inner-icon="mdi-gender-male-female"
                          variant="outlined"
                          clearable
                          class="form-field"
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Contact Information Section -->
                <v-expansion-panel class="form-section-panel" :class="{ 'editing-mode': isEditing }">
                  <v-expansion-panel-title class="form-section-title">
                    <div class="d-flex align-center">
                      <v-icon class="mr-3" color="info">mdi-phone-message</v-icon>
                      <span class="font-weight-bold">Contact Information</span>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="form-section-content">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="formData.region"
                          :density="fieldDensity"
                          label="Phone Region *"
                          :items="phoneRegionOptions"
                          :rules="[rules.required]"
                          :error-messages="errors.region"
                          @blur="validateField('region')"
                          @update:model-value="onRegionChange"
                          prepend-inner-icon="mdi-earth"
                          variant="outlined"
                          clearable
                          class="form-field region-selector"
                        />
                      </v-col>
                      
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="formData.phoneNumber"
                          :density="fieldDensity"
                          label="Phone Number *"
                          :placeholder="phoneNumberPlaceholder"
                          :rules="[rules.required, rules.phoneNumber]"
                          :error-messages="errors.phoneNumber"
                          @blur="validateField('phoneNumber')"
                          @input="formatPhoneNumber"
                          prepend-inner-icon="mdi-phone"
                          variant="outlined"
                          clearable
                          class="form-field"
                        />
                        <div v-if="selectedRegionInfo" class="phone-format-info">
                          <div class="d-flex align-center">
                            <span class="region-flag">{{ selectedRegionInfo.flag }}</span>
                            <span class="text-caption">
                              <strong>Format:</strong> {{ selectedRegionInfo.format }} | 
                              <strong>Example:</strong> {{ selectedRegionInfo.example }}
                            </span>
                          </div>
                          <div v-if="selectedRegionInfo.name === 'India'" class="text-caption text-grey mt-2">
                            💡 <strong>Tip:</strong> You can enter with or without +91. The system will automatically format it.
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                    
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="formData.email"
                          :density="fieldDensity"
                          label="Email Address *"
                          placeholder="Enter your email address"
                          type="email"
                          :rules="[rules.required, rules.email]"
                          :error-messages="errors.email"
                          @blur="validateField('email')"
                          prepend-inner-icon="mdi-email"
                          variant="outlined"
                          clearable
                          class="form-field"
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Security Section -->
                <v-expansion-panel class="form-section-panel" :class="{ 'editing-mode': isEditing }">
                  <v-expansion-panel-title class="form-section-title">
                    <div class="d-flex align-center">
                      <v-icon class="mr-3" color="warning">mdi-shield-lock</v-icon>
                      <span class="font-weight-bold">Security</span>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="form-section-content">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="formData.password"
                          :density="fieldDensity"
                          label="Password *"
                          placeholder="Enter your password"
                          :type="showPassword ? 'text' : 'password'"
                          :rules="[rules.required, rules.password]"
                          :error-messages="errors.password"
                          @blur="validateField('password')"
                          @input="validatePassword"
                          prepend-inner-icon="mdi-lock"
                          variant="outlined"
                          clearable
                          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                          @click:append-inner="showPassword = !showPassword"
                          class="form-field"
                        />
                        
                        <!-- Password Strength Indicator -->
                        <v-card v-if="passwordStrength" class="mt-2 pa-3 password-strength-card" :color="getPasswordStrengthColor()">
                          <v-card-text class="pa-2">
                            <div class="d-flex align-center mb-2">
                              <v-icon :color="getPasswordStrengthColor()" class="mr-2">mdi-shield-check</v-icon>
                              <span class="text-subtitle-2 font-weight-bold">Password Strength:</span>
                              <v-progress-linear
                                :model-value="passwordStrength.score * 16.67"
                                :color="getPasswordStrengthColor()"
                                height="8"
                                class="ml-3 flex-grow-1"
                              />
                              <span class="ml-2 text-caption">{{ passwordStrength.score }}/6</span>
                            </div>
                            <div v-if="passwordStrength.feedback.length > 0">
                              <div v-for="(feedback, index) in passwordStrength.feedback" :key="index" class="text-caption">
                                <v-icon :color="getPasswordStrengthColor()" size="small" class="mr-1">
                                  {{ passwordStrength.isValid ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                                </v-icon>
                                {{ feedback }}
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="formData.confirmPassword"
                          :density="fieldDensity"
                          label="Confirm Password *"
                          placeholder="Confirm your password"
                          :type="showConfirmPassword ? 'text' : 'password'"
                          :rules="[rules.required, rules.confirmPassword]"
                          :error-messages="errors.confirmPassword"
                          @blur="validateField('confirmPassword')"
                          prepend-inner-icon="mdi-lock-check"
                          variant="outlined"
                          clearable
                          :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                          @click:append-inner="showConfirmPassword = !showConfirmPassword"
                          class="form-field"
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Action Buttons -->
              <v-row class="mt-6">
                <v-col cols="12">
                  <div class="actions">
                    <v-btn
                      color="secondary"
                      variant="outlined"
                      @click="resetForm"
                      :disabled="isLoading"
                      prepend-icon="mdi-refresh"
                      class="action-btn"
                    >
                      Reset Form
                    </v-btn>
                    
                    <v-btn
                      color="primary"
                      type="submit"
                      :loading="isLoading"
                      :disabled="!isFormValid || isLoading"
                      prepend-icon="mdi-account-plus"
                      size="large"
                      class="action-btn primary-action"
                    >
                      {{ isEditing ? 'Update Profile' : 'Create Account' }}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Success/Error Messages -->
        <v-snackbar
          v-model="showSnackbar"
          :color="snackbarColor"
          :timeout="5000"
          location="top"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-2" :color="snackbarColor === 'success' ? 'white' : 'white'">
              {{ snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
            </v-icon>
            {{ snackbarMessage }}
          </div>
          <template v-slot:actions>
            <v-btn
              color="white"
              variant="text"
              @click="showSnackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { ValidationService } from '@/utils/validation';
import type { UserProfile, Gender, PasswordStrength, PhoneRegion, PhoneRegionInfo } from '@/types/user';
import { useDisplay } from 'vuetify';

// Props
interface Props {
  user?: UserProfile;
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false
});

// Emits
const emit = defineEmits<{
  userCreated: [user: UserProfile];
  userUpdated: [user: UserProfile];
  formReset: [];
}>();

// Store
const userStore = useUserStore();

// Display
const { smAndDown } = useDisplay();
const fieldDensity = computed(() => (smAndDown.value ? 'compact' : 'comfortable'));

// Form ref
const form = ref<any>(null);

// Reactive data
const isFormValid = ref(false);
const activePanel = ref([0, 1, 2]);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordStrength = ref<PasswordStrength | null>(null);
const isLoading = ref(false);

// Form data
const formData = reactive({
  fullName: '',
  age: '',
  gender: '' as Gender | '',
  region: 'india' as PhoneRegion,
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Form errors
const errors = reactive({
  fullName: '',
  age: '',
  gender: '',
  region: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Snackbar
const showSnackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

// Gender options
const genderOptions = [
  { title: 'Male', value: 'male' },
  { title: 'Female', value: 'female' },
  { title: 'Non-binary', value: 'non-binary' },
  { title: 'Prefer not to say', value: 'prefer-not-to-say' },
  { title: 'Other', value: 'other' }
];

// Phone region options
const phoneRegionOptions = computed(() => {
  const regions = ValidationService.getPhoneRegions();
  return Object.entries(regions).map(([key, region]) => ({
    title: `${region.flag} ${region.name} (${region.code})`,
    value: key as PhoneRegion
  }));
});

// Computed properties
const selectedRegionInfo = computed(() => {
  return ValidationService.getPhoneRegionInfo(formData.region);
});

const phoneNumberPlaceholder = computed(() => {
  if (selectedRegionInfo.value) {
    if (selectedRegionInfo.value.name === 'India') {
      return 'Enter 10-digit mobile number (e.g., 9876543210)';
    }
    return `Enter ${selectedRegionInfo.value.name} phone number`;
  }
  return 'Enter your phone number';
});

// Validation rules
const rules = {
  required: (v: any) => !!v || 'This field is required',
  fullName: (v: string) => {
    const validation = ValidationService.validateFullName(v);
    return validation.isValid || validation.error || 'Invalid full name';
  },
  age: (v: any) => {
    const validation = ValidationService.validateAge(v);
    return validation.isValid || validation.error || 'Invalid age';
  },
  phoneNumber: (v: string) => {
    const validation = ValidationService.validatePhoneNumber(v);
    return validation.isValid || validation.error || 'Invalid phone number';
  },
  email: (v: string) => {
    const validation = ValidationService.validateEmail(v);
    return validation.isValid || validation.error || 'Invalid email';
  },
  password: (v: string) => {
    const validation = ValidationService.validatePassword(v);
    return validation.isValid || validation.error || 'Invalid password';
  },
  confirmPassword: (v: string) => {
    const validation = ValidationService.validateConfirmPassword(formData.password, v);
    return validation.isValid || validation.error || 'Passwords do not match';
  }
};

// Methods
const validateField = (fieldName: keyof typeof errors) => {
  const fieldValue = (formData as any)[fieldName];
  
  switch (fieldName) {
    case 'fullName': {
      const nameValidation = ValidationService.validateFullName(fieldValue);
      errors.fullName = nameValidation.isValid ? '' : nameValidation.error || '';
      break;
    }
    case 'age': {
      const ageValidation = ValidationService.validateAge(fieldValue);
      errors.age = ageValidation.isValid ? '' : ageValidation.error || '';
      break;
    }
    case 'gender': {
      const genderValidation = ValidationService.validateGender(fieldValue);
      errors.gender = genderValidation.isValid ? '' : genderValidation.error || '';
      break;
    }
    case 'region': {
      const regionValidation = ValidationService.validatePhoneRegion(fieldValue);
      errors.region = regionValidation.isValid ? '' : regionValidation.error || '';
      break;
    }
          case 'phoneNumber': {
        const phoneValidation = ValidationService.validatePhoneNumber(fieldValue, formData.region);
        errors.phoneNumber = phoneValidation.isValid ? '' : phoneValidation.error || '';
        break;
      }
    case 'email': {
      const emailValidation = ValidationService.validateEmail(fieldValue);
      errors.email = emailValidation.isValid ? '' : emailValidation.error || '';
      break;
    }
    case 'password': {
      const passwordValidation = ValidationService.validatePassword(fieldValue);
      errors.password = passwordValidation.isValid ? '' : passwordValidation.error || '';
      passwordStrength.value = passwordValidation.strength;
      break;
    }
    case 'confirmPassword': {
      const confirmValidation = ValidationService.validateConfirmPassword(formData.password, fieldValue);
      errors.confirmPassword = confirmValidation.isValid ? '' : confirmValidation.error || '';
      break;
    }
  }
};

const validatePassword = () => {
  if (formData.password) {
    const validation = ValidationService.validatePassword(formData.password);
    passwordStrength.value = validation.strength;
    errors.password = validation.isValid ? '' : validation.error || '';
  }
};

const formatPhoneNumber = () => {
  if (formData.phoneNumber) {
    // Clean the input first to remove extra spaces and format consistently
    const cleaned = formData.phoneNumber.replace(/\s+/g, ' ').trim();
    formData.phoneNumber = ValidationService.formatPhoneNumber(cleaned, formData.region);
  }
};

const onRegionChange = (value: PhoneRegion) => {
  formData.region = value;
  validateField('region');
};

const getPasswordStrengthColor = (): string => {
  if (!passwordStrength.value) return 'grey';
  
  const score = passwordStrength.value.score;
  if (score <= 2) return 'error';
  if (score <= 3) return 'warning';
  if (score <= 4) return 'info';
  if (score <= 5) return 'success';
  return 'success';
};

const showMessage = (message: string, color: string = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  showSnackbar.value = true;
};

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    if (key === 'region') {
      (formData as any)[key] = 'india';
    } else {
      (formData as any)[key] = '';
    }
  });
  
  Object.keys(errors).forEach(key => {
    (errors as any)[key] = '';
  });
  
  passwordStrength.value = null;
  activePanel.value = [0, 1, 2];
  
  if (form.value) {
    form.value.reset();
  }
  
  emit('formReset');
  showMessage('Form has been reset', 'info');
};

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    
    const validation = ValidationService.validateForm(formData);
    if (!validation.isValid) {
      Object.keys(validation.errors).forEach(key => {
        (errors as any)[key] = (validation.errors as any)[key];
      });
      showMessage('Please fix the errors in the form', 'error');
      return;
    }
    
    if (!userStore.isEmailUnique(formData.email)) {
      errors.email = 'Email already exists';
      showMessage('Email already exists', 'error');
      return;
    }
    
    const userData = {
      fullName: formData.fullName.trim(),
      age: parseInt(formData.age as string, 10),
      gender: formData.gender as Gender,
      region: formData.region,
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };
    
    if (props.isEditing && props.user) {
      const updatedUser = await userStore.updateUser(props.user.id, userData);
      showMessage('Profile updated successfully!', 'success');
      emit('userUpdated', updatedUser);
    } else {
      const newUser = await userStore.createUser(userData);
      showMessage('Account created successfully!', 'success');
      emit('userCreated', newUser);
    }
    
    resetForm();
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    showMessage(errorMessage, 'error');
  } finally {
    isLoading.value = false;
  }
};

// Watch for changes in form data to clear errors
watch(() => formData.fullName, () => errors.fullName = '');
watch(() => formData.age, () => errors.age = '');
watch(() => formData.gender, () => errors.gender = '');
watch(() => formData.region, () => errors.region = '');
watch(() => formData.phoneNumber, () => errors.phoneNumber = '');
watch(() => formData.email, () => errors.email = '');
watch(() => formData.password, () => errors.password = '');
watch(() => formData.confirmPassword, () => errors.confirmPassword = '');

onMounted(() => {
  if (props.isEditing && props.user) {
    formData.fullName = props.user.fullName;
    formData.age = props.user.age.toString();
    formData.gender = props.user.gender;
    formData.region = props.user.region || 'india';
    formData.phoneNumber = props.user.phoneNumber;
    formData.email = props.user.email;
    formData.password = props.user.password;
    formData.confirmPassword = props.user.password;
    validatePassword();
  }
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

/* Expansion Panels */
.v-expansion-panels {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}

.v-expansion-panel {
  margin-bottom: 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.v-expansion-panel:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.v-expansion-panel-title {
  font-weight: 600;
  color: #2c3e50;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.v-expansion-panel-text {
  padding: 32px;
  background: #ffffff;
}

/* Form Fields */
.v-text-field,
.v-select,
.v-textarea {
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.v-text-field:hover,
.v-select:hover,
.v-textarea:hover {
  transform: translateY(-2px);
}

.v-text-field :deep(.v-field),
.v-select :deep(.v-field),
.v-textarea :deep(.v-field) {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.v-text-field :deep(.v-field:hover),
.v-select :deep(.v-field:hover),
.v-textarea :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Buttons */
.v-btn {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  padding: 12px 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.v-btn:active {
  transform: translateY(-1px);
}

/* Password Strength Meter */
.password-strength-meter {
  margin-top: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.strength-bar {
  height: 10px;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.strength-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 8px;
  text-align: center;
}

/* Form Actions */
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  margin: 32px -24px -24px -24px;
  padding: 24px;
  border-radius: 0 0 12px 12px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .gradient-header .text-h3 {
    font-size: 2rem !important;
  }
  
  .gradient-header .text-h6 {
    font-size: 1rem !important;
  }
  
  .v-expansion-panel-text {
    padding: 24px;
  }
}

@media (max-width: 600px) {
  .gradient-header .pa-8 {
    padding: 32px 16px !important;
  }
  
  .v-expansion-panel-text {
    padding: 16px;
  }
  
  .v-btn {
    width: 100%;
    margin-bottom: 12px;
    padding: 16px 24px;
  }
  
  .actions {
    margin: 24px -16px -16px -16px;
    padding: 20px 16px;
    flex-direction: column;
    align-items: stretch;
  }
}

/* Smooth Animations */
.v-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-expansion-panel {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Icon Enhancements */
.v-expansion-panel-title .v-icon {
  transition: all 0.3s ease;
}

.v-expansion-panel:hover .v-expansion-panel-title .v-icon {
  transform: scale(1.1);
  color: #667eea;
}

/* Enhanced Form Sections */
.form-sections {
  margin-bottom: 24px;
}

.form-section-panel {
  margin-bottom: 16px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.form-section-panel:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
  border-color: rgba(102, 126, 234, 0.2);
}

.form-section-title {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px 24px;
  font-weight: 600;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.form-section-panel:hover .form-section-title {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.form-section-content {
  padding: 32px;
  background: #ffffff;
}

.form-field {
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.form-field:hover {
  transform: translateY(-2px);
}

.form-field :deep(.v-field) {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.form-field :deep(.v-field:hover) {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

/* Password Strength Card */
.password-strength-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.password-strength-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Enhanced Action Buttons */
.action-btn {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  padding: 14px 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 140px;
}

.action-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

.action-btn:active {
  transform: translateY(-2px);
}

.primary-action {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.primary-action:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

/* Enhanced Actions Container */
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  margin: 32px -24px -24px -24px;
  padding: 28px 24px;
  border-radius: 0 0 16px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

/* Responsive Design Improvements */
@media (max-width: 960px) {
  .form-section-content {
    padding: 24px;
  }
  
  .actions {
    padding: 24px;
  }
}

@media (max-width: 600px) {
  .form-section-content {
    padding: 20px 16px;
  }
  
  .form-section-title {
    padding: 16px 20px;
  }
  
  .action-btn {
    width: 100%;
    margin-bottom: 12px;
    padding: 16px 24px;
    min-width: auto;
  }
  
  .actions {
    margin: 24px -16px -16px -16px;
    padding: 20px 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .v-expansion-panels {
    margin-bottom: 16px;
  }
  
  .form-section-panel {
    margin-bottom: 12px;
  }
}

/* Editing Mode Enhancements */
.form-section-panel.editing-mode {
  border-color: rgba(102, 126, 234, 0.3);
  background: rgba(102, 126, 234, 0.02);
}

.form-section-panel.editing-mode .form-section-title {
  background: linear-gradient(135deg, #e8f4fd 0%, #d1ecf1 100%);
  color: #2c3e50;
}

/* Focus States */
.form-field :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

/* Loading States */
.form-field :deep(.v-field--loading) {
  opacity: 0.7;
}

/* Error States Enhancement */
.form-field :deep(.v-field--error) {
  border-color: #f44336;
  box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.1);
}

/* Success States */
.form-field :deep(.v-field--success) {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

/* Additional Responsive Improvements */
@media (max-width: 480px) {
  .gradient-header .pa-8 {
    padding: 24px 16px !important;
  }
  
  .gradient-header .text-h3 {
    font-size: 1.75rem !important;
  }
  
  .gradient-header .text-h6 {
    font-size: 0.875rem !important;
  }
  
  .gradient-header .v-icon {
    font-size: 48px !important;
  }
  
  .form-section-content {
    padding: 16px 12px;
  }
  
  .form-section-title {
    padding: 16px 20px;
  }
  
  .actions {
    margin: 20px -12px -12px -12px;
    padding: 16px 12px;
  }
}

/* Form Field Spacing Improvements */
.form-field + .form-field {
  margin-top: 16px;
}

/* Smooth Transitions for All Interactive Elements */
.v-expansion-panel-title,
.v-expansion-panel-text,
.v-text-field,
.v-select,
.v-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Better Visual Hierarchy for Editing Mode */
.form-section-panel.editing-mode .form-section-title {
  border-bottom: 2px solid rgba(102, 126, 234, 0.2);
}

/* Improved Button States */
.action-btn:disabled {
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.action-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

/* Enhanced Form Validation Visual Feedback */
.form-field :deep(.v-field--error) .v-field__outline {
  border-color: #f44336;
}

.form-field :deep(.v-field--success) .v-field__outline {
  border-color: #4caf50;
}

/* Better Mobile Touch Targets */
@media (max-width: 600px) {
  .v-btn {
    min-height: 48px;
  }
  
  .v-expansion-panel-title {
    min-height: 56px;
  }
  
  .form-field :deep(.v-field) {
    min-height: 48px;
  }
}

/* Region Selector Styling */
.v-select.region-selector :deep(.v-field) {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.v-select.region-selector :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Phone Number Format Display */
.phone-format-info {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 8px;
  border-left: 3px solid #667eea;
  transition: all 0.3s ease;
}

.phone-format-info:hover {
  background: rgba(102, 126, 234, 0.08);
  transform: translateX(2px);
}

.phone-format-info .v-icon {
  margin-right: 6px;
  font-size: 14px;
}

/* Enhanced Region Display */
.region-flag {
  font-size: 16px;
  margin-right: 8px;
}

.region-name {
  font-weight: 500;
  color: #2c3e50;
}

.region-code {
  color: #667eea;
  font-weight: 600;
  margin-left: 4px;
}
</style>
