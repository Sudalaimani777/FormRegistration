import type { PasswordStrength, Gender, PhoneRegion, PhoneRegionInfo } from '@/types/user';

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

// Phone number validation - updated for region-based validation
// const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone region configurations
const PHONE_REGIONS: Record<PhoneRegion, PhoneRegionInfo> = {
  india: {
    code: '+91',
    name: 'India',
    flag: '🇮🇳',
    format: 'XXXX XXX XXXX',
    minLength: 10,
    maxLength: 10,
    pattern: /^[6-9]\d{9}$/,
    example: '9876543210'
  },
  usa: {
    code: '+1',
    name: 'United States',
    flag: '🇺🇸',
    format: '(XXX) XXX-XXXX',
    minLength: 10,
    maxLength: 10,
    pattern: /^[2-9]\d{9}$/,
    example: '5551234567'
  },
  uk: {
    code: '+44',
    name: 'United Kingdom',
    flag: '🇬🇧',
    format: 'XXXX XXXXXX',
    minLength: 10,
    maxLength: 11,
    pattern: /^[1-9]\d{9,10}$/,
    example: '7912345678'
  },
  canada: {
    code: '+1',
    name: 'Canada',
    flag: '🇨🇦',
    format: '(XXX) XXX-XXXX',
    minLength: 10,
    maxLength: 10,
    pattern: /^[2-9]\d{9}$/,
    example: '4161234567'
  },
  australia: {
    code: '+61',
    name: 'Australia',
    flag: '🇦🇺',
    format: 'X XXXX XXXX',
    minLength: 9,
    maxLength: 9,
    pattern: /^[2-9]\d{8}$/,
    example: '412345678'
  },
  germany: {
    code: '+49',
    name: 'Germany',
    flag: '🇩🇪',
    format: 'XXX XXXXXXX',
    minLength: 10,
    maxLength: 12,
    pattern: /^[1-9]\d{9,11}$/,
    example: '30123456789'
  },
  france: {
    code: '+33',
    name: 'France',
    flag: '🇫🇷',
    format: 'X XX XX XX XX',
    minLength: 9,
    maxLength: 9,
    pattern: /^[1-9]\d{8}$/,
    example: '123456789'
  },
  japan: {
    code: '+81',
    name: 'Japan',
    flag: '🇯🇵',
    format: 'XX XXXX XXXX',
    minLength: 10,
    maxLength: 10,
    pattern: /^[1-9]\d{9}$/,
    example: '9012345678'
  },
  china: {
    code: '+86',
    name: 'China',
    flag: '🇨🇳',
    format: 'XXX XXXX XXXX',
    minLength: 11,
    maxLength: 11,
    pattern: /^1[3-9]\d{9}$/,
    example: '13812345678'
  },
  brazil: {
    code: '+55',
    name: 'Brazil',
    flag: '🇧🇷',
    format: '(XX) XXXXX-XXXX',
    minLength: 10,
    maxLength: 11,
    pattern: /^[1-9]\d{9,10}$/,
    example: '11987654321'
  },
  other: {
    code: '+',
    name: 'Other',
    flag: '🌍',
    format: 'Variable',
    minLength: 7,
    maxLength: 15,
    pattern: /^[1-9]\d{6,14}$/,
    example: '123456789'
  }
};

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

  // Phone region validation
  static validatePhoneRegion(region: PhoneRegion | string): { isValid: boolean; error?: string } {
    const validRegions: PhoneRegion[] = ['india', 'usa', 'uk', 'canada', 'australia', 'germany', 'france', 'japan', 'china', 'brazil', 'other'];
    
    if (!region || region.trim().length === 0) {
      return { isValid: false, error: 'Phone region selection is required' };
    }
    
    if (!validRegions.includes(region as PhoneRegion)) {
      return { isValid: false, error: 'Please select a valid phone region' };
    }
    
    return { isValid: true };
  }

  // Phone number validation
  static validatePhoneNumber(phone: string, region: PhoneRegion = 'india'): { isValid: boolean; error?: string } {
    if (!phone || phone.trim().length === 0) {
      return { isValid: false, error: 'Phone number is required' };
    }
    
    const regionInfo = PHONE_REGIONS[region];
    
    // Clean the phone number and handle country codes properly
    let cleanedPhone = phone.replace(/[^\d+]/g, '');
    let phoneWithoutCode = cleanedPhone;
    
    // Handle different country code formats
    const countryCode = regionInfo.code.replace('+', '');
    
    // Check if the phone starts with the country code
    if (cleanedPhone.startsWith(countryCode)) {
      phoneWithoutCode = cleanedPhone.slice(countryCode.length);
    }
    // Also check if it starts with + followed by country code
    else if (cleanedPhone.startsWith('+' + countryCode)) {
      phoneWithoutCode = cleanedPhone.slice(1 + countryCode.length);
    }
    
    // Additional validation for India: ensure the number starts with valid digits
    if (region === 'india' && phoneWithoutCode.length === 10) {
      const firstDigit = parseInt(phoneWithoutCode.charAt(0));
      if (firstDigit < 6 || firstDigit > 9) {
        return { isValid: false, error: 'Indian mobile numbers must start with 6, 7, 8, or 9' };
      }
    }
    
    if (phoneWithoutCode.length < regionInfo.minLength) {
      return { isValid: false, error: `Phone number must be at least ${regionInfo.minLength} digits long for ${regionInfo.name}` };
    }
    
    if (phoneWithoutCode.length > regionInfo.maxLength) {
      return { isValid: false, error: `Phone number cannot exceed ${regionInfo.maxLength} digits for ${regionInfo.name}` };
    }
    
    if (!regionInfo.pattern.test(phoneWithoutCode)) {
      return { isValid: false, error: `Please enter a valid ${regionInfo.name} phone number format` };
    }
    
    return { isValid: true };
  }

  // Get all available phone regions
  static getPhoneRegions(): Record<PhoneRegion, PhoneRegionInfo> {
    return PHONE_REGIONS;
  }

  // Get specific region info
  static getPhoneRegionInfo(region: PhoneRegion): PhoneRegionInfo {
    return PHONE_REGIONS[region];
  }

  // Format phone number based on region
  static formatPhoneNumber(phone: string, region: PhoneRegion = 'india'): string {
    const regionInfo = PHONE_REGIONS[region];
    const cleaned = phone.replace(/\D/g, '');
    
    // Remove country code if present - use the same logic as validation
    let phoneWithoutCode = cleaned;
    const countryCode = regionInfo.code.replace('+', '');
    
    // Check if the phone starts with the country code
    if (cleaned.startsWith(countryCode)) {
      phoneWithoutCode = cleaned.slice(countryCode.length);
    }
    // Also check if it starts with + followed by country code
    else if (cleaned.startsWith('+' + countryCode)) {
      phoneWithoutCode = cleaned.slice(1 + countryCode.length);
    }
    
    switch (region) {
      case 'india':
        if (phoneWithoutCode.length === 10) {
          return `${regionInfo.code} ${phoneWithoutCode.slice(0, 5)} ${phoneWithoutCode.slice(5)}`;
        }
        break;
        
      case 'usa':
      case 'canada':
        if (phoneWithoutCode.length === 10) {
          return `${regionInfo.code} (${phoneWithoutCode.slice(0, 3)}) ${phoneWithoutCode.slice(3, 6)}-${phoneWithoutCode.slice(6)}`;
        }
        break;
        
      case 'uk':
        if (phoneWithoutCode.length === 10) {
          return `${regionInfo.code} ${phoneWithoutCode.slice(0, 4)} ${phoneWithoutCode.slice(4)}`;
        } else if (phoneWithoutCode.length === 11) {
          return `${regionInfo.code} ${phoneWithoutCode.slice(0, 4)} ${phoneWithoutCode.slice(4)}`;
        }
        break;
        
      case 'australia':
        if (phoneWithoutCode.length === 9) {
          return `${regionInfo.code} ${phoneWithoutCode.slice(0, 1)} ${phoneWithoutCode.slice(1, 5)} ${phoneWithoutCode.slice(5)}`;
        }
        break;
        
      case 'germany':
        if (phoneWithoutCode.length === 10) {
          return `${regionInfo.code} ${phoneWithoutCode.slice(0, 3)} ${phoneWithoutCode.slice(3)}`;
        } else if (phoneWithoutCode.length === 11) {
          return `${regionInfo.code} ${phoneWithoutCode.slice(0, 3)} ${phoneWithoutCode.slice(3)}`;
        }
        break;
        
      case 'france':
        if (phoneWithoutCode.length === 9) {
          return `${regionInfo.code} ${phoneWithoutCode.slice(0, 1)} ${phoneWithoutCode.slice(1, 3)} ${phoneWithoutCode.slice(3, 5)} ${phoneWithoutCode.slice(5, 7)} ${phoneWithoutCode.slice(7)}`;
        }
        break;
        
      case 'japan':
        if (phoneWithoutCode.length === 10) {
          return `${regionInfo.code} ${phoneWithoutCode.slice(0, 2)} ${phoneWithoutCode.slice(2, 6)} ${phoneWithoutCode.slice(6)}`;
        }
        break;
        
      case 'china':
        if (phoneWithoutCode.length === 11) {
          return `${regionInfo.code} ${phoneWithoutCode.slice(0, 3)} ${phoneWithoutCode.slice(3, 7)} ${phoneWithoutCode.slice(7)}`;
        }
        break;
        
      case 'brazil':
        if (phoneWithoutCode.length === 10) {
          return `${regionInfo.code} (${phoneWithoutCode.slice(0, 2)}) ${phoneWithoutCode.slice(2, 7)}-${phoneWithoutCode.slice(7)}`;
        } else if (phoneWithoutCode.length === 11) {
          return `${regionInfo.code} (${phoneWithoutCode.slice(0, 2)}) ${phoneWithoutCode.slice(2, 7)}-${phoneWithoutCode.slice(7)}`;
        }
        break;
        
      default:
        // For other regions, use a generic format
        if (phoneWithoutCode.length >= 7 && phoneWithoutCode.length <= 15) {
          return `${regionInfo.code} ${phoneWithoutCode}`;
        }
    }
    
    // Return original if no specific formatting applies
    return phone;
  }

  // Detect phone number region automatically
  static detectPhoneRegion(phone: string): PhoneRegion | null {
    const cleaned = phone.replace(/\D/g, '');
    
    // Check for country codes
    if (cleaned.startsWith('91')) return 'india';
    if (cleaned.startsWith('1')) return 'usa'; // Could be USA or Canada
    if (cleaned.startsWith('44')) return 'uk';
    if (cleaned.startsWith('61')) return 'australia';
    if (cleaned.startsWith('49')) return 'germany';
    if (cleaned.startsWith('33')) return 'france';
    if (cleaned.startsWith('81')) return 'japan';
    if (cleaned.startsWith('86')) return 'china';
    if (cleaned.startsWith('55')) return 'brazil';
    
    // Check length patterns for common regions
    if (cleaned.length === 10) {
      // Could be India, USA, Canada, etc.
      if (cleaned.startsWith('6') || cleaned.startsWith('7') || cleaned.startsWith('8') || cleaned.startsWith('9')) {
        return 'india';
      }
      return 'usa';
    }
    
    return null;
  }

  // Get formatted example for a region
  static getPhoneExample(region: PhoneRegion): string {
    const regionInfo = PHONE_REGIONS[region];
    return this.formatPhoneNumber(regionInfo.example, region);
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
    
    const phoneValidation = this.validatePhoneNumber(formData.phoneNumber, formData.region || 'india');
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
