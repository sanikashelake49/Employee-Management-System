import apiClient from '../../services/apiClient';
import employeeService from '../../services/employeeService';

jest.mock('../../services/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  EMPLOYEE_API_BASE_URL: 'https://mock-api.test/employee',
  COUNTRY_API_BASE_URL: 'https://mock-api.test/country',
  extractErrorMessage: jest.fn((error, fallback) => fallback),
}));

describe('employeeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches all employees', async () => {
    const employees = [{ id: '1', name: 'Jane Doe' }];
    apiClient.get.mockResolvedValueOnce({ data: employees });

    const result = await employeeService.getAllEmployees();

    expect(apiClient.get).toHaveBeenCalledWith('https://mock-api.test/employee');
    expect(result).toEqual(employees);
  });

  it('fetches a single employee by id', async () => {
    const employee = { id: '7', name: 'John Smith' };
    apiClient.get.mockResolvedValueOnce({ data: employee });

    const result = await employeeService.getEmployeeById('7');

    expect(apiClient.get).toHaveBeenCalledWith('https://mock-api.test/employee/7');
    expect(result).toEqual(employee);
  });

  it('creates a new employee', async () => {
    const newEmployee = { name: 'New Hire', email: 'new@test.com' };
    const created = { id: '9', ...newEmployee };
    apiClient.post.mockResolvedValueOnce({ data: created });

    const result = await employeeService.createEmployee(newEmployee);

    expect(apiClient.post).toHaveBeenCalledWith(
      'https://mock-api.test/employee',
      newEmployee
    );
    expect(result).toEqual(created);
  });

  it('updates an existing employee', async () => {
    const updates = { name: 'Updated Name' };
    apiClient.put.mockResolvedValueOnce({ data: { id: '3', ...updates } });

    const result = await employeeService.updateEmployee('3', updates);

    expect(apiClient.put).toHaveBeenCalledWith(
      'https://mock-api.test/employee/3',
      updates
    );
    expect(result).toEqual({ id: '3', ...updates });
  });

  it('deletes an employee', async () => {
    apiClient.delete.mockResolvedValueOnce({ data: { id: '3' } });

    const result = await employeeService.deleteEmployee('3');

    expect(apiClient.delete).toHaveBeenCalledWith('https://mock-api.test/employee/3');
    expect(result).toEqual({ id: '3' });
  });

  it('propagates errors from the API client', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('network down'));

    await expect(employeeService.getAllEmployees()).rejects.toThrow('network down');
  });
});
