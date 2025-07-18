import { validationRules, validateField, validateForm } from '../../utils/validation';

describe('Validation', () => {
  describe('validateField', () => {
    it('should validate required fields', () => {
      const rules = [validationRules.required('Name')];
      
      expect(validateField('John Doe', rules).isValid).toBe(true);
      expect(validateField('', rules).isValid).toBe(false);
      expect(validateField('   ', rules).isValid).toBe(false);
    });

    it('should validate email format', () => {
      const rules = [validationRules.email()];
      
      expect(validateField('test@example.com', rules).isValid).toBe(true);
      expect(validateField('user.name@domain.co.uk', rules).isValid).toBe(true);
      expect(validateField('test+tag@example.org', rules).isValid).toBe(true);
      
      expect(validateField('invalid-email', rules).isValid).toBe(false);
      expect(validateField('test@', rules).isValid).toBe(false);
      expect(validateField('@example.com', rules).isValid).toBe(false);
    });

    it('should validate name format', () => {
      const rules = [validationRules.name()];
      
      expect(validateField('John Doe', rules).isValid).toBe(true);
      expect(validateField('Alice', rules).isValid).toBe(true);
      expect(validateField('Jean-Pierre', rules).isValid).toBe(false); // Contains hyphen
      
      expect(validateField('A', rules).isValid).toBe(false);
      expect(validateField('A'.repeat(51), rules).isValid).toBe(false);
    });

    it('should validate password requirements', () => {
      const rules = [validationRules.password()];
      
      expect(validateField('Password123!', rules).isValid).toBe(true);
      expect(validateField('password', rules).isValid).toBe(false); // No uppercase, number, special char
      expect(validateField('PASSWORD', rules).isValid).toBe(false); // No lowercase, number, special char
      expect(validateField('Pass1!', rules).isValid).toBe(false); // Too short
    });
  });

  describe('validateForm', () => {
    it('should validate entire form', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      
      const fieldRules = {
        name: [validationRules.required('Name'), validationRules.name()],
        email: [validationRules.required('Email'), validationRules.email()],
        password: [validationRules.required('Password'), validationRules.password()],
      };
      
      const errors = validateForm(formData, fieldRules);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should return errors for invalid form', () => {
      const formData = {
        name: 'A',
        email: 'invalid-email',
        password: 'weak',
      };
      
      const fieldRules = {
        name: [validationRules.required('Name'), validationRules.name()],
        email: [validationRules.required('Email'), validationRules.email()],
        password: [validationRules.required('Password'), validationRules.password()],
      };
      
      const errors = validateForm(formData, fieldRules);
      expect(Object.keys(errors)).toHaveLength(3);
    });
  });
});