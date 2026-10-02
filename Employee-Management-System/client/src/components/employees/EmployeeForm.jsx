import React, { useEffect, useState } from 'react';
import { validateEmployeeForm, isFormValid } from '../../utils/validation';

const EMPTY_VALUES = {
  name: '',
  email: '',
  mobile: '',
  country: '',
  state: '',
  district: '',
};

/**
 * Dumb component: owns only the transient, per-keystroke form state and
 * client-side validation. It has no idea how the values get persisted -
 * that responsibility belongs to the smart page component that renders it.
 */
const EmployeeForm = ({
  initialValues,
  countries,
  countriesStatus,
  countriesError,
  onRetryCountries,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
  submitLabel = 'Save',
}) => {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues) {
      setValues({ ...EMPTY_VALUES, ...initialValues });
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validateEmployeeForm({ ...values }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateEmployeeForm(values);
    setErrors(validationErrors);
    setTouched({
      name: true,
      email: true,
      mobile: true,
      country: true,
      state: true,
      district: true,
    });

    if (!isFormValid(validationErrors)) {
      return;
    }

    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      mobile: values.mobile.trim(),
      country: values.country,
      state: values.state.trim(),
      district: values.district.trim(),
    });
  };

  const handleReset = () => {
    setValues({ ...EMPTY_VALUES, ...initialValues });
    setErrors({});
    setTouched({});
  };

  const fieldError = (field) => (touched[field] ? errors[field] : undefined);

  return (
    <form noValidate onSubmit={handleSubmit} aria-label="Employee form">
      {submitError && (
        <div className="alert alert-danger" role="alert">
          {submitError}
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label htmlFor="name" className="form-label">
            Name <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-control${fieldError('name') ? ' is-invalid' : ''}`}
            placeholder="Enter full name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={Boolean(fieldError('name'))}
          />
          {fieldError('name') && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="email" className="form-label">
            Email <span className="text-danger">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-control${fieldError('email') ? ' is-invalid' : ''}`}
            placeholder="name@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={Boolean(fieldError('email'))}
          />
          {fieldError('email') && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="mobile" className="form-label">
            Mobile <span className="text-danger">*</span>
          </label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            className={`form-control${fieldError('mobile') ? ' is-invalid' : ''}`}
            placeholder="10-digit mobile number"
            value={values.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={10}
            aria-required="true"
            aria-invalid={Boolean(fieldError('mobile'))}
          />
          {fieldError('mobile') && (
            <div className="invalid-feedback">{errors.mobile}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="country" className="form-label">
            Country <span className="text-danger">*</span>
          </label>
          {countriesStatus === 'failed' ? (
            <div className="d-flex align-items-center gap-2">
              <span className="text-danger small">{countriesError}</span>
              {onRetryCountries && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={onRetryCountries}
                >
                  Retry
                </button>
              )}
            </div>
          ) : (
            <select
              id="country"
              name="country"
              className={`form-select${fieldError('country') ? ' is-invalid' : ''}`}
              value={values.country}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={countriesStatus === 'loading'}
              aria-required="true"
              aria-invalid={Boolean(fieldError('country'))}
            >
              <option value="">
                {countriesStatus === 'loading' ? 'Loading countries...' : 'Select a country'}
              </option>
              {countries.map((country) => (
                <option key={country.id} value={country.country}>
                  {country.country}
                </option>
              ))}
            </select>
          )}
          {fieldError('country') && (
            <div className="invalid-feedback d-block">{errors.country}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="state" className="form-label">
            State <span className="text-danger">*</span>
          </label>
          <input
            id="state"
            name="state"
            type="text"
            className={`form-control${fieldError('state') ? ' is-invalid' : ''}`}
            placeholder="Enter state"
            value={values.state}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={Boolean(fieldError('state'))}
          />
          {fieldError('state') && (
            <div className="invalid-feedback">{errors.state}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="district" className="form-label">
            District <span className="text-danger">*</span>
          </label>
          <input
            id="district"
            name="district"
            type="text"
            className={`form-control${fieldError('district') ? ' is-invalid' : ''}`}
            placeholder="Enter district"
            value={values.district}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={Boolean(fieldError('district'))}
          />
          {fieldError('district') && (
            <div className="invalid-feedback">{errors.district}</div>
          )}
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          Reset
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EmployeeForm;
