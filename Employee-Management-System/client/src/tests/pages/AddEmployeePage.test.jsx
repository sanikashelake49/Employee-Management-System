import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import countryService from '../../services/countryService';
import toast from 'react-hot-toast';
import employeeReducer from '../../features/employees/employeeSlice';
import countryReducer from '../../features/countries/countrySlice';
import AddEmployeePage from '../../pages/AddEmployeePage';

jest.mock('../../services/employeeService');
jest.mock('../../services/countryService');
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderPage = () => {
  const store = configureStore({
    reducer: { employees: employeeReducer, countries: countryReducer },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <AddEmployeePage />
      </MemoryRouter>
    </Provider>
  );
};

describe('AddEmployeePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    countryService.getAllCountries.mockResolvedValue([
      { id: '1', country: 'India' },
    ]);
  });

  it('does not call the API when the form is invalid', async () => {
    renderPage();
    await screen.findByText('India');

    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));

    expect(employeeService.createEmployee).not.toHaveBeenCalled();
  });

  it('creates the employee and navigates to the list on success', async () => {
    employeeService.createEmployee.mockResolvedValueOnce({
      id: '10',
      name: 'Brand New',
    });
    renderPage();
    await screen.findByText('India');

    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Brand New' } });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'brand@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/^mobile/i), {
      target: { value: '9876543210' },
    });
    fireEvent.change(screen.getByLabelText(/^country/i), { target: { value: 'India' } });
    fireEvent.change(screen.getByLabelText(/^state/i), { target: { value: 'MH' } });
    fireEvent.change(screen.getByLabelText(/^district/i), { target: { value: 'Pune' } });

    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));

    await waitFor(() => expect(employeeService.createEmployee).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows a toast error and stays on the page when creation fails', async () => {
    employeeService.createEmployee.mockRejectedValueOnce(new Error('server error'));
    renderPage();
    await screen.findByText('India');

    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Brand New' } });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'brand@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/^mobile/i), {
      target: { value: '9876543210' },
    });
    fireEvent.change(screen.getByLabelText(/^country/i), { target: { value: 'India' } });
    fireEvent.change(screen.getByLabelText(/^state/i), { target: { value: 'MH' } });
    fireEvent.change(screen.getByLabelText(/^district/i), { target: { value: 'Pune' } });

    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
