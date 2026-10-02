import { configureStore } from '@reduxjs/toolkit';
import employeeService from '../../services/employeeService';
import employeeReducer, {
  fetchEmployees,
  fetchEmployeeById,
  searchEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from '../../features/employees/employeeSlice';

jest.mock('../../services/employeeService');

const buildStore = () =>
  configureStore({ reducer: { employees: employeeReducer } });

describe('employeeSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has the expected initial state', () => {
    const store = buildStore();
    expect(store.getState().employees).toEqual({
      employees: [],
      listStatus: 'idle',
      listError: null,
      selectedEmployee: null,
      selectedStatus: 'idle',
      selectedError: null,
      searchResult: null,
      searchStatus: 'idle',
      searchError: null,
      operationStatus: 'idle',
      operationError: null,
    });
  });

  describe('fetchEmployees', () => {
    it('sets loading state while pending', () => {
      const store = buildStore();
      store.dispatch({ type: fetchEmployees.pending.type });
      expect(store.getState().employees.listStatus).toBe('loading');
    });

    it('stores employees on success', async () => {
      const employees = [{ id: '1', name: 'Jane' }];
      employeeService.getAllEmployees.mockResolvedValueOnce(employees);
      const store = buildStore();

      await store.dispatch(fetchEmployees());

      expect(store.getState().employees.listStatus).toBe('succeeded');
      expect(store.getState().employees.employees).toEqual(employees);
    });

    it('stores an error message on failure', async () => {
      employeeService.getAllEmployees.mockRejectedValueOnce(new Error('boom'));
      const store = buildStore();

      await store.dispatch(fetchEmployees());

      expect(store.getState().employees.listStatus).toBe('failed');
      expect(store.getState().employees.listError).toBeTruthy();
    });
  });

  describe('fetchEmployeeById (edit pre-population)', () => {
    it('stores the selected employee on success', async () => {
      const employee = { id: '4', name: 'Sam' };
      employeeService.getEmployeeById.mockResolvedValueOnce(employee);
      const store = buildStore();

      await store.dispatch(fetchEmployeeById('4'));

      expect(store.getState().employees.selectedStatus).toBe('succeeded');
      expect(store.getState().employees.selectedEmployee).toEqual(employee);
    });
  });

  describe('searchEmployeeById', () => {
    it('marks search as not_found on failure', async () => {
      employeeService.getEmployeeById.mockRejectedValueOnce(new Error('missing'));
      const store = buildStore();

      await store.dispatch(searchEmployeeById('999'));

      expect(store.getState().employees.searchStatus).toBe('not_found');
      expect(store.getState().employees.searchResult).toBeNull();
    });

    it('stores the search result on success', async () => {
      const employee = { id: '2', name: 'Found Me' };
      employeeService.getEmployeeById.mockResolvedValueOnce(employee);
      const store = buildStore();

      await store.dispatch(searchEmployeeById('2'));

      expect(store.getState().employees.searchStatus).toBe('succeeded');
      expect(store.getState().employees.searchResult).toEqual(employee);
    });
  });

  describe('addEmployee', () => {
    it('appends the created employee to the list', async () => {
      const created = { id: '5', name: 'New Person' };
      employeeService.createEmployee.mockResolvedValueOnce(created);
      const store = buildStore();

      await store.dispatch(addEmployee({ name: 'New Person' }));

      expect(store.getState().employees.operationStatus).toBe('succeeded');
      expect(store.getState().employees.employees).toContainEqual(created);
    });

    it('records an operation error on failure', async () => {
      employeeService.createEmployee.mockRejectedValueOnce(new Error('fail'));
      const store = buildStore();

      await store.dispatch(addEmployee({ name: 'Bad Data' }));

      expect(store.getState().employees.operationStatus).toBe('failed');
      expect(store.getState().employees.operationError).toBeTruthy();
    });
  });

  describe('updateEmployee', () => {
    it('replaces the matching employee in the list', async () => {
      employeeService.updateEmployee.mockResolvedValueOnce({ name: 'Updated' });
      const store = configureStore({
        reducer: { employees: employeeReducer },
        preloadedState: {
          employees: {
            employees: [{ id: '1', name: 'Old' }],
            listStatus: 'succeeded',
            listError: null,
            selectedEmployee: null,
            selectedStatus: 'idle',
            selectedError: null,
            searchResult: null,
            searchStatus: 'idle',
            searchError: null,
            operationStatus: 'idle',
            operationError: null,
          },
        },
      });

      await store.dispatch(
        updateEmployee({ id: '1', employeeData: { name: 'Updated' } })
      );

      expect(store.getState().employees.employees[0].name).toBe('Updated');
    });
  });

  describe('deleteEmployee', () => {
    it('removes the employee from the list on success', async () => {
      employeeService.deleteEmployee.mockResolvedValueOnce({});
      const store = configureStore({
        reducer: { employees: employeeReducer },
        preloadedState: {
          employees: {
            employees: [{ id: '1', name: 'To Delete' }],
            listStatus: 'succeeded',
            listError: null,
            selectedEmployee: null,
            selectedStatus: 'idle',
            selectedError: null,
            searchResult: null,
            searchStatus: 'idle',
            searchError: null,
            operationStatus: 'idle',
            operationError: null,
          },
        },
      });

      await store.dispatch(deleteEmployee('1'));

      expect(store.getState().employees.employees).toHaveLength(0);
      expect(store.getState().employees.operationStatus).toBe('succeeded');
    });

    it('keeps the employee in the list if the delete fails', async () => {
      employeeService.deleteEmployee.mockRejectedValueOnce(new Error('cannot delete'));
      const store = configureStore({
        reducer: { employees: employeeReducer },
        preloadedState: {
          employees: {
            employees: [{ id: '1', name: 'Stays' }],
            listStatus: 'succeeded',
            listError: null,
            selectedEmployee: null,
            selectedStatus: 'idle',
            selectedError: null,
            searchResult: null,
            searchStatus: 'idle',
            searchError: null,
            operationStatus: 'idle',
            operationError: null,
          },
        },
      });

      await store.dispatch(deleteEmployee('1'));

      expect(store.getState().employees.employees).toHaveLength(1);
      expect(store.getState().employees.operationStatus).toBe('failed');
    });
  });
});
