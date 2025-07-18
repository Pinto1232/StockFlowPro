import React from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateField = (value: string, rules: ValidationRule[]): ValidationResult => {
  for (const rule of rules) {
    // Required validation
    if (rule.required && (!value || value.trim().length === 0)) {
      return { isValid: false, error: rule.message };
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim().length === 0) {
      continue;
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return { isValid: false, error: rule.message };
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return { isValid: false, error: rule.message };
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return { isValid: false, error: rule.message };
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      return { isValid: false, error: rule.message };
    }
  }

  return { isValid: true };
};

// Common validation rules
export const validationRules = {
  required: (fieldName: string): ValidationRule => ({
    required: true,
    message: `${fieldName} is required`,
  }),

  email: (): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  }),

  password: (): ValidationRule => ({
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  }),

  passwordSimple: (): ValidationRule => ({
    minLength: 6,
    message: 'Password must be at least 6 characters long',
  }),

  confirmPassword: (originalPassword: string): ValidationRule => ({
    custom: (value: string) => value === originalPassword,
    message: 'Passwords do not match',
  }),

  phone: (): ValidationRule => ({
    pattern: /^[+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number',
  }),

  name: (): ValidationRule => ({
    pattern: /^[a-zA-Z\s]{2,50}$/,
    message: 'Name must contain only letters and be 2-50 characters long',
  }),

  username: (): ValidationRule => ({
    pattern: /^[a-zA-Z0-9_]{3,20}$/,
    message: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores',
  }),

  dateOfBirth: (): ValidationRule => ({
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    custom: (value: string) => {
      const date = new Date(value);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      return date <= now && age >= 13 && age <= 120;
    },
    message: 'Please enter a valid date (YYYY-MM-DD) and you must be at least 13 years old',
  }),
};

// Form validation helper
export const validateForm = (
  formData: Record<string, string>,
  fieldRules: Record<string, ValidationRule[]>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(fieldRules).forEach(fieldName => {
    const value = formData[fieldName] || '';
    const rules = fieldRules[fieldName];
    const result = validateField(value, rules);
    
    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
    }
  });

  return errors;
};

// Real-time validation hook
export const useFormValidation = (
  initialData: Record<string, string>,
  fieldRules: Record<string, ValidationRule[]>
) => {
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const validateSingleField = (fieldName: string, value: string) => {
    const rules = fieldRules[fieldName];
    if (!rules) return;

    const result = validateField(value, rules);
    setErrors(prev => ({
      ...prev,
      [fieldName]: result.error || '',
    }));
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Validate on change if field has been touched
    if (touched[fieldName]) {
      validateSingleField(fieldName, value);
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateSingleField(fieldName, formData[fieldName] || '');
  };

  const validateAllFields = () => {
    const allErrors = validateForm(formData, fieldRules);
    setErrors(allErrors);
    setTouched(
      Object.keys(fieldRules).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    return Object.keys(allErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    handleFieldChange,
    handleFieldBlur,
    validateAllFields,
    resetForm,
    isValid: Object.keys(errors).length === 0,
  };
};