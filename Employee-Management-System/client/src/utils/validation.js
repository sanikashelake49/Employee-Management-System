// Centralized validation rules for the employee form so the same logic
// backs both the UI and the unit tests.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/; // 10-digit Indian mobile number

export const validateEmployeeForm = (values) => {
  const errors = {};

  const name = (values.name || '').trim();
  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length < 3) {
    errors.name = 'Name must be at least 3 characters.';
  } else if (name.length > 50) {
    errors.name = 'Name must be under 50 characters.';
  }

  const email = (values.email || '').trim();
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const mobile = (values.mobile || '').trim();
  if (!mobile) {
    errors.mobile = 'Mobile number is required.';
  } else if (!MOBILE_REGEX.test(mobile)) {
    errors.mobile = 'Mobile number must be 10 digits.';
  }

  if (!values.country || !String(values.country).trim()) {
    errors.country = 'Country is required.';
  }

  const state = (values.state || '').trim();
  if (!state) {
    errors.state = 'State is required.';
  } else if (state.length > 50) {
    errors.state = 'State must be under 50 characters.';
  }

  const district = (values.district || '').trim();
  if (!district) {
    errors.district = 'District is required.';
  } else if (district.length > 50) {
    errors.district = 'District must be under 50 characters.';
  }

  return errors;
};

export const isFormValid = (errors) => Object.keys(errors).length === 0;
