import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import employeeReducer from '../../features/employees/employeeSlice';
import SearchEmployeePage from '../../pages/SearchEmployeePage';

jest.mock('../../services/employeeService');

const renderPage = () => {
  const store = configureStore({ reducer: { employees: employeeReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <SearchEmployeePage />
      </MemoryRouter>
    </Provider>
  );
};

describe('SearchEmployeePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays the employee when found', async () => {
    employeeService.getEmployeeById.mockResolvedValueOnce({
      id: '2',
      name: 'Found Person',
      email: 'found@test.com',
      mobile: '9876543210',
      country: 'India',
      state: 'MH',
      district: 'Pune',
    });
    renderPage();

    fireEvent.change(screen.getByPlaceholderText('Enter Employee ID'), {
      target: { value: '2' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^search$/i }));

    expect(await screen.findByText('Found Person')).toBeInTheDocument();
  });

  it('shows "Employee not found." when the API returns a 404', async () => {
    const error = new Error('not found');
    error.response = { status: 404 };
    employeeService.getEmployeeById.mockRejectedValueOnce(error);
    renderPage();

    fireEvent.change(screen.getByPlaceholderText('Enter Employee ID'), {
      target: { value: '999' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^search$/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/not found/i);
  });

  it('does not call the API when the id field is empty', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /^search$/i }));
    expect(employeeService.getEmployeeById).not.toHaveBeenCalled();
  });
});
