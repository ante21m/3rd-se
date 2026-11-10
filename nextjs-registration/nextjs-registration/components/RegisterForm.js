'use client';
// "use client" = this component runs in the browser (it uses state and events).

import { useState } from 'react';
import { validateRegistration, passwordStrength } from '@/lib/validation';

const initialValues = { name: '', email: '', password: '', confirmPassword: '', acceptTerms: false };
const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

export default function RegisterForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', text: '' });

    // Client-side check for fast feedback
    const result = validateRegistration(values);
    setErrors(result.errors);
    if (!result.valid) return;

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', text: `Welcome, ${data.user.name}! Your account was created.` });
        setValues(initialValues);
        setErrors({});
      } else {
        setErrors(data.errors || {});
        setStatus({ type: 'error', text: data.message || 'Registration failed.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  const strength = passwordStrength(values.password);

  return (
    <form onSubmit={handleSubmit} noValidate className="card">
      <h1>Create an account</h1>

      {status.text && <div className={`alert ${status.type}`} role="alert">{status.text}</div>}

      <label htmlFor="name">Full name</label>
      <input id="name" name="name" type="text" autoComplete="name"
        value={values.name} onChange={handleChange} aria-invalid={!!errors.name} />
      {errors.name && <p className="error">{errors.name}</p>}

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email"
        value={values.email} onChange={handleChange} aria-invalid={!!errors.email} />
      {errors.email && <p className="error">{errors.email}</p>}

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="new-password"
        value={values.password} onChange={handleChange} aria-invalid={!!errors.password} />
      {values.password && (
        <div className="strength" aria-live="polite">
          <div className={`bar s${strength}`} />
          <span>{strengthLabels[strength]}</span>
        </div>
      )}
      {errors.password && <p className="error">{errors.password}</p>}

      <label htmlFor="confirmPassword">Confirm password</label>
      <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password"
        value={values.confirmPassword} onChange={handleChange} aria-invalid={!!errors.confirmPassword} />
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

      <label className="check">
        <input name="acceptTerms" type="checkbox" checked={values.acceptTerms} onChange={handleChange} />
        I accept the terms and conditions
      </label>
      {errors.acceptTerms && <p className="error">{errors.acceptTerms}</p>}

      <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
    </form>
  );
}
