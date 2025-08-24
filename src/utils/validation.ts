import type { PasswordStrength, Gender } from '@/types/user';

// Password validation constants
const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_REGEX = {
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBERS: /\d/,
  SPECIAL_CHARS: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
};

// Age validation constants
const MIN_AGE = 13;
const MAX_AGE = 120;

// Phone number validation
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ValidationService {
  // Full name validation
  static validateFullName(name: string): { isValid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: 'Full name is required' };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: 'Full name must be at least 2 characters long' };
    }
    
    if (name.trim().length > 100) {
      return { isValid: false, error: 'Full name cannot exceed 100 characters' };
    }
    
    // Check if name contains only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(name.trim())) {
      return { isValid: false, error: 'Full name can only contain letters, spaces, hyphens, and apostrophes' };
    }
    
    return { isValid: true };
  }

  // Age validation
  static validateAge(age: number | string): { isValid: boolean; error?: string } {
    const numAge = typeof age === 'string' ? parseInt(age, 10) : age;
    
    if (isNaN(numAge) || numAge <= 0) {
      return { isValid: false, error: 'Age must be a valid positive number' };
    }
    
    if (numAge < MIN_AGE) {
      return { isValid: false, error: `Age must be at least ${MIN_AGE} years old` };
    }
    
    if (numAge > MAX_AGE) {
      return { isValid: false, error: `Age cannot exceed ${MAX_AGE} years` };
    }
    
    if (!Number.isInteger(numAge)) {
      return { isValid: false, error: 'Age must be a whole number' };
    }
    
    return { isValid: true };
  }

  // Gender validation
  static validateGender(gender: Gender | string): { isValid: boolean; error?: string } {
    const validGenders: Gender[] = ['male', 'female', 'non-binary', 'prefer-not-to-say', 'other'];
    
    if (!gender || gender.trim().length === 0) {
      return { isValid: false, error: 'Gender selection is required' };
    }
    
    if (!validGenders.includes(gender as Gender)) {
      return { isValid: false, error: 'Please select a valid gender option' };
    }
    
    return { isValid: true };
  }

  // Phone number validation
  static validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
    if (!phone || phone.trim().length === 0) {
      return { isValid: false, error: 'Phone number is required' };
    }
    
    // Remove all non-digit characters except + for international format
    const cleanedPhone = phone.replace(/[^\d+]/g, '');
    
    if (cleanedPhone.length < 10) {
      return { isValid: false, error: 'Phone number must be at least 10 digits long' };
    }
    
    if (cleanedPhone.length > 16) {
      return { isValid: false, error: 'Phone number cannot exceed 16 digits' };
    }
    
    if (!PHONE_REGEX.test(cleanedPhone)) {
      return { isValid: false, error: 'Please enter a valid phone number format' };
    }
    
    return { isValid: true };
  }

  // Format phone number for display
  static formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    return phone;
  }

  // Email validation
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email || email.trim().length === 0) {
      return { isValid: false, error: 'Email address is required' };
    }
    
    if (email.trim().length > 254) {
      return { isValid: false, error: 'Email address cannot exceed 254 characters' };
    }
    
    if (!EMAIL_REGEX.test(email.trim())) {
      return { isValid: false, error: 'Please enter a valid email address format' };
    }
    
    // Check for common email format issues
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      return { isValid: false, error: 'Email address contains invalid formatting' };
    }
    
    return { isValid: true };
  }

  // Password validation with strength assessment
  static validatePassword(password: string): { isValid: boolean; error?: string; strength: PasswordStrength } {
    if (!password || password.length === 0) {
      return { 
        isValid: false, 
        error: 'Password is required',
        strength: { score: 0, feedback: ['Password is required'], isValid: false }
      };
    }
    
    if (password.length < MIN_PASSWORD_LENGTH) {
      return { 
        isValid: false, 
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
        strength: { score: 0, feedback: [`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`], isValid: false }
      };
    }
    
    const strength = this.assessPasswordStrength(password);
    
    if (!strength.isValid) {
      return { 
        isValid: false, 
        error: 'Password does not meet security requirements',
        strength
      };
    }
    
    return { isValid: true, strength };
  }

  // Password strength assessment
  static assessPasswordStrength(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;
    
    // Length check
    if (password.length >= MIN_PASSWORD_LENGTH) {
      score += 1;
    } else {
      feedback.push(`At least ${MIN_PASSWORD_LENGTH} characters`);
    }
    
    // Character variety checks
    if (PASSWORD_REGEX.UPPERCASE.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one uppercase letter (A-Z)');
    }
    
    if (PASSWORD_REGEX.LOWERCASE.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one lowercase letter (a-z)');
    }
    
    if (PASSWORD_REGEX.NUMBERS.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one number (0-9)');
    }
    
    if (PASSWORD_REGEX.SPECIAL_CHARS.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one special character (!@#$%^&*)');
    }
    
    // Additional complexity checks
    if (password.length >= 12) {
      score += 1;
    }
    
    if (password.length >= 16) {
      score += 1;
    }
    
    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      score -= 1;
      feedback.push('Avoid repeated characters');
    }
    
    if (/123|abc|qwe|password|admin/i.test(password)) {
      score -= 1;
      feedback.push('Avoid common patterns');
    }
    
    // Determine if password meets minimum requirements
    const isValid = score >= 4 && password.length >= MIN_PASSWORD_LENGTH;
    
    return {
      score: Math.max(0, score),
      feedback: feedback.length > 0 ? feedback : ['Password meets all requirements'],
      isValid
    };
  }

  // Confirm password validation
  static validateConfirmPassword(password: string, confirmPassword: string): { isValid: boolean; error?: string } {
    if (!confirmPassword || confirmPassword.length === 0) {
      return { isValid: false, error: 'Please confirm your password' };
    }
    
    if (password !== confirmPassword) {
      return { isValid: false, error: 'Passwords do not match' };
    }
    
    return { isValid: true };
  }

  // Comprehensive form validation
  static validateForm(formData: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    
    // Validate each field
    const fullNameValidation = this.validateFullName(formData.fullName);
    if (!fullNameValidation.isValid) {
      errors.fullName = fullNameValidation.error!;
    }
    
    const ageValidation = this.validateAge(formData.age);
    if (!ageValidation.isValid) {
      errors.age = ageValidation.error!;
    }
    
    const genderValidation = this.validateGender(formData.gender);
    if (!genderValidation.isValid) {
      errors.gender = genderValidation.error!;
    }
    
    const phoneValidation = this.validatePhoneNumber(formData.phoneNumber);
    if (!phoneValidation.isValid) {
      errors.phoneNumber = phoneValidation.error!;
    }
    
    const emailValidation = this.validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!;
    }
    
    const passwordValidation = this.validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error!;
    }
    
    const confirmPasswordValidation = this.validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      errors.confirmPassword = confirmPasswordValidation.error!;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
