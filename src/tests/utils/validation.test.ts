import { ValidationUtils } from '../../utils/validation';

describe('ValidationUtils', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(ValidationUtils.isValidEmail('test@example.com')).toBe(true);
      expect(ValidationUtils.isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(ValidationUtils.isValidEmail('test+tag@example.org')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(ValidationUtils.isValidEmail('invalid-email')).toBe(false);
      expect(ValidationUtils.isValidEmail('test@')).toBe(false);
      expect(ValidationUtils.isValidEmail('@example.com')).toBe(false);
      expect(ValidationUtils.isValidEmail('')).toBe(false);
    });
  });

  describe('isValidName', () => {
    it('should return true for valid names', () => {
      expect(ValidationUtils.isValidName('John Doe')).toBe(true);
      expect(ValidationUtils.isValidName('Alice')).toBe(true);
      expect(ValidationUtils.isValidName('Jean-Pierre')).toBe(true);
    });

    it('should return false for invalid names', () => {
      expect(ValidationUtils.isValidName('')).toBe(false);
      expect(ValidationUtils.isValidName(' ')).toBe(false);
      expect(ValidationUtils.isValidName('A')).toBe(false);
      expect(ValidationUtils.isValidName('A'.repeat(51))).toBe(false);
    });
  });

  describe('isValidId', () => {
    it('should return true for valid IDs', () => {
      expect(ValidationUtils.isValidId('abc123')).toBe(true);
      expect(ValidationUtils.isValidId('user_123')).toBe(true);
      expect(ValidationUtils.isValidId('test-id')).toBe(true);
    });

    it('should return false for invalid IDs', () => {
      expect(ValidationUtils.isValidId('invalid@id')).toBe(false);
      expect(ValidationUtils.isValidId('id with spaces')).toBe(false);
      expect(ValidationUtils.isValidId('')).toBe(false);
    });
  });

  describe('validateCreateUserInput', () => {
    it('should return valid for correct input', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      const result = ValidationUtils.validateCreateUserInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for incorrect input', () => {
      const input = {
        name: 'A',
        email: 'invalid-email',
      };
      const result = ValidationUtils.validateCreateUserInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe('sanitizeString', () => {
    it('should remove dangerous characters', () => {
      expect(ValidationUtils.sanitizeString('  <script>alert("xss")</script>  ')).toBe('scriptalert("xss")/script');
      expect(ValidationUtils.sanitizeString('  Normal text  ')).toBe('Normal text');
    });
  });
});