import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmployeeForm from '../../components/employees/EmployeeForm';

const countries = [
  { id: '1', country: 'India' },
  { id: '2', country: 'Singapore' },
];

const fillValidForm = () => {
  fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByLabelText(/^email/i), {
    target: { value: 'jane@test.com' },
  });
  fireEvent.change(screen.getByLabelText(/^mobile/i), {
    target: { value: '9876543210' },
  });
  fireEvent.change(screen.getByLabelText(/^country/i), {
    target: { value: 'India' },
  });
  fireEvent.change(screen.getByLabelText(/^state/i), {
    target: { value: 'Maharashtra' },
  });
  fireEvent.change(screen.getByLabelText(/^district/i), {
    target: { value: 'Pune' },
  });
};

const renderForm = (props = {}) =>
  render(
    <EmployeeForm
      countries={countries}
      countriesStatus="succeeded"
      countriesError={null}
      onSubmit={jest.fn()}
      isSubmitting={false}
      submitError={null}
      {...props}
    />
  );

describe('EmployeeForm', () => {
  it('renders all required fields', () => {
    renderForm();
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^mobile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^district/i)).toBeInTheDocument();
  });

  it('shows required-field validation errors on empty submit', () => {
    const onSubmit = jest.fn();
    renderForm({ onSubmit });

    fireEvent.click(screen.getByRole('button', { name: /save|add employee|update employee/i }));

    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Mobile number is required.')).toBeInTheDocument();
    expect(screen.getByText('Country is required.')).toBeInTheDocument();
    expect(screen.getByText('State is required.')).toBeInTheDocument();
    expect(screen.getByText('District is required.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows an email validation error for an invalid address', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john@' } });
    fireEvent.blur(screen.getByLabelText(/^email/i));

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('shows a mobile validation error for an invalid number', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/^mobile/i), { target: { value: '12345' } });
    fireEvent.blur(screen.getByLabelText(/^mobile/i));

    expect(screen.getByText('Mobile number must be 10 digits.')).toBeInTheDocument();
  });

  it('rejects a name that is too short', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Jo' } });
    fireEvent.blur(screen.getByLabelText(/^name/i));

    expect(screen.getByText('Name must be at least 3 characters.')).toBeInTheDocument();
  });

  it('does not submit an invalid form', () => {
    const onSubmit = jest.fn();
    renderForm({ onSubmit });
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'not-an-email' } });

    fireEvent.click(screen.getByRole('button', { name: /save|add employee|update employee/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits trimmed values when the form is valid', () => {
    const onSubmit = jest.fn();
    renderForm({ onSubmit });

    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /save|add employee|update employee/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@test.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune',
    });
  });

  it('pre-populates fields from initialValues for editing', () => {
    renderForm({
      initialValues: {
        name: 'Existing Person',
        email: 'existing@test.com',
        mobile: '9123456780',
        country: 'Singapore',
        state: 'Central',
        district: 'Downtown',
      },
    });

    expect(screen.getByLabelText(/^name/i)).toHaveValue('Existing Person');
    expect(screen.getByLabelText(/^email/i)).toHaveValue('existing@test.com');
    expect(screen.getByLabelText(/^country/i)).toHaveValue('Singapore');
  });
});
