// Shared validation: used by the browser form (instant feedback)
// AND by the API route (the real security check).
// Never trust only client-side validation - anyone can call the API directly.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistration(values) {
  const errors = {};
  const name = (values.name || '').trim();
  const email = (values.email || '').trim().toLowerCase();
  const password = values.password || '';
  const confirmPassword = values.confirmPassword || '';

  if (name.length < 2 || name.length > 50) {
    errors.name = 'Name must be between 2 and 50 characters.';
  }

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    errors.email = 'Please enter a valid email address.';
  }

  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  } else if (password.length > 72) {
    // bcrypt only uses the first 72 bytes
    errors.password = 'Password must be 72 characters or fewer.';
  } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = 'Password needs an uppercase letter, a lowercase letter, and a number.';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (values.acceptTerms !== true) {
    errors.acceptTerms = 'You must accept the terms to register.';
  }

  return { valid: Object.keys(errors).length === 0, errors, clean: { name, email, password } };
}

// Simple 0-4 score for the strength meter on the form
export function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score++;
  return score;
}
