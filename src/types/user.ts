export interface UserPersonalDetails {
  fullName: string;
  age: number;
  gender: Gender;
}

export interface UserContactInfo {
  phoneNumber: string;
  email: string;
  region?: PhoneRegion;
}

export interface UserCredentials {
  password: string;
  confirmPassword: string;
}

export interface UserProfile extends UserPersonalDetails, UserContactInfo, UserCredentials {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';

export type PhoneRegion = 'india' | 'usa' | 'uk' | 'canada' | 'australia' | 'germany' | 'france' | 'japan' | 'china' | 'brazil' | 'other';

export interface PhoneRegionInfo {
  code: string;
  name: string;
  flag: string;
  format: string;
  minLength: number;
  maxLength: number;
  pattern: RegExp;
  example: string;
}

export interface ValidationRules {
  fullName: boolean;
  age: boolean;
  gender: boolean;
  phoneNumber: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

export interface FormErrors {
  fullName?: string;
  age?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  region?: string;
}

export interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}
