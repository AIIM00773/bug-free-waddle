/**
 * Input validation utilities
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  return { valid: true };
};


export const validateName = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  return { valid: true };
};



export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};


export const sanitizeInput = (input: string): string => {
  return input.trim();
};
