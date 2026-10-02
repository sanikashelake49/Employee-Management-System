import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import toast from 'react-hot-toast';
import employeeReducer from '../../features/employees/employeeSlice';
import EmployeeListPage from '../../pages/EmployeeListPage';

jest.mock('../../services/employeeService');
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
  const store = configureStore({ reducer: { employees: employeeReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <EmployeeListPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('EmployeeListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading indicator while employees are being fetched', () => {
    employeeService.getAllEmployees.mockReturnValueOnce(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/loading employees/i)).toBeInTheDocument();
  });

  it('renders the employee list once loaded', async () => {
    employeeService.getAllEmployees.mockResolvedValueOnce([
      {
        id: '1',
        name: 'Jane Doe',
        email: 'jane@test.com',
        mobile: '9876543210',
        country: 'India',
        state: 'Maharashtra',
        district: 'Pune',
      },
    ]);
    renderPage();

    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
  });

  it('shows an empty state when there are no employees', async () => {
    employeeService.getAllEmployees.mockResolvedValueOnce([]);
    renderPage();

    expect(await screen.findByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No employees found.')).toBeInTheDocument();
  });

  it('shows an error message when the fetch fails', async () => {
    employeeService.getAllEmployees.mockRejectedValueOnce(new Error('down'));
    renderPage();

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('navigates to the edit page when Edit is clicked', async () => {
    employeeService.getAllEmployees.mockResolvedValueOnce([
      { id: '1', name: 'Jane Doe', email: 'jane@test.com', mobile: '9876543210', country: 'India', state: 'MH', district: 'Pune' },
    ]);
    renderPage();
    await screen.findByText('Jane Doe');

    fireEvent.click(screen.getByRole('button', { name: /edit jane doe/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/employees/edit/1');
  });

  it('does not delete the employee when the confirmation is cancelled', async () => {
    employeeService.getAllEmployees.mockResolvedValueOnce([
      { id: '1', name: 'Jane Doe', email: 'jane@test.com', mobile: '9876543210', country: 'India', state: 'MH', district: 'Pune' },
    ]);
    renderPage();
    await screen.findByText('Jane Doe');

    fireEvent.click(screen.getByRole('button', { name: /delete jane doe/i }));
    expect(screen.getByText(/are you sure you want to delete this employee/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));

    expect(employeeService.deleteEmployee).not.toHaveBeenCalled();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('deletes the employee when the confirmation is accepted', async () => {
    employeeService.getAllEmployees.mockResolvedValueOnce([
      { id: '1', name: 'Jane Doe', email: 'jane@test.com', mobile: '9876543210', country: 'India', state: 'MH', district: 'Pune' },
    ]);
    employeeService.deleteEmployee.mockResolvedValueOnce({});
    renderPage();
    await screen.findByText('Jane Doe');

    fireEvent.click(screen.getByRole('button', { name: /delete jane doe/i }));
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => expect(employeeService.deleteEmployee).toHaveBeenCalledWith('1'));
    await waitFor(() => expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument());
    expect(toast.success).toHaveBeenCalled();
  });

  it('shows an error toast when deletion fails', async () => {
    employeeService.getAllEmployees.mockResolvedValueOnce([
      { id: '1', name: 'Jane Doe', email: 'jane@test.com', mobile: '9876543210', country: 'India', state: 'MH', district: 'Pune' },
    ]);
    employeeService.deleteEmployee.mockRejectedValueOnce(new Error('cannot delete'));
    renderPage();
    await screen.findByText('Jane Doe');

    fireEvent.click(screen.getByRole('button', { name: /delete jane doe/i }));
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
