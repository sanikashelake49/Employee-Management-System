import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import countryService from '../../services/countryService';
import toast from 'react-hot-toast';
import employeeReducer from '../../features/employees/employeeSlice';
import countryReducer from '../../features/countries/countrySlice';
import EditEmployeePage from '../../pages/EditEmployeePage';

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

const existingEmployee = {
  id: '1',
  name: 'Jane Doe',
  email: 'jane@test.com',
  mobile: '9876543210',
  country: 'India',
  state: 'Maharashtra',
  district: 'Pune',
};

const renderPage = () => {
  const store = configureStore({
    reducer: { employees: employeeReducer, countries: countryReducer },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/employees/edit/1']}>
        <Routes>
          <Route path="/employees/edit/:id" element={<EditEmployeePage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('EditEmployeePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    countryService.getAllCountries.mockResolvedValue([
      { id: '1', country: 'India' },
    ]);
  });

  it('loads and pre-populates the existing employee', async () => {
    employeeService.getEmployeeById.mockResolvedValueOnce(existingEmployee);
    renderPage();

    expect(await screen.findByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@test.com')).toBeInTheDocument();
    expect(employeeService.getEmployeeById).toHaveBeenCalledWith('1');
  });

  it('shows an error message when loading the employee fails', async () => {
    employeeService.getEmployeeById.mockRejectedValueOnce(new Error('not found'));
    renderPage();

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('submits the updated employee and navigates back to the list', async () => {
    employeeService.getEmployeeById.mockResolvedValueOnce(existingEmployee);
    employeeService.updateEmployee.mockResolvedValueOnce({
      ...existingEmployee,
      name: 'Jane Updated',
    });
    renderPage();

    await screen.findByDisplayValue('Jane Doe');
    fireEvent.change(screen.getByLabelText(/^name/i), {
      target: { value: 'Jane Updated' },
    });
    fireEvent.click(screen.getByRole('button', { name: /update employee/i }));

    await waitFor(() =>
      expect(employeeService.updateEmployee).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ name: 'Jane Updated' })
      )
    );
    expect(toast.success).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
