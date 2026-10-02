import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import employeeService from '../../services/employeeService';
import { extractErrorMessage } from '../../services/apiClient';

// ---------------------------------------------------------------------------
// Async thunks
// ---------------------------------------------------------------------------

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await employeeService.getAllEmployees();
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, 'Unable to load employees. Please try again.')
      );
    }
  }
);

// Used by the Edit page to pre-populate the form.
export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await employeeService.getEmployeeById(id);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, 'Unable to load employee details.')
      );
    }
  }
);

// Used by the "Search by ID" feature - kept separate from fetchEmployeeById
// so searching does not disturb whatever is loaded for editing.
export const searchEmployeeById = createAsyncThunk(
  'employees/searchById',
  async (id, { rejectWithValue }) => {
    try {
      return await employeeService.getEmployeeById(id);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, 'Employee not found.')
      );
    }
  }
);

export const addEmployee = createAsyncThunk(
  'employees/add',
  async (employeeData, { rejectWithValue }) => {
    try {
      return await employeeService.createEmployee(employeeData);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, 'Unable to create employee. Please try again.')
      );
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const result = await employeeService.updateEmployee(id, employeeData);
      // Some mock APIs echo back only the changed fields; make sure the id
      // is always present so the reducer can find the record to replace.
      return { id, ...result };
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, 'Unable to update employee. Please try again.')
      );
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { rejectWithValue }) => {
    try {
      await employeeService.deleteEmployee(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, 'Unable to delete employee. Please try again.')
      );
    }
  }
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const initialState = {
  employees: [],
  listStatus: 'idle', // idle | loading | succeeded | failed
  listError: null,

  selectedEmployee: null,
  selectedStatus: 'idle',
  selectedError: null,

  searchResult: null,
  searchStatus: 'idle', // idle | loading | succeeded | not_found | failed
  searchError: null,

  operationStatus: 'idle', // idle | loading | succeeded | failed
  operationError: null,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearSelectedEmployee(state) {
      state.selectedEmployee = null;
      state.selectedStatus = 'idle';
      state.selectedError = null;
    },
    clearSearchResult(state) {
      state.searchResult = null;
      state.searchStatus = 'idle';
      state.searchError = null;
    },
    resetOperationStatus(state) {
      state.operationStatus = 'idle';
      state.operationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchEmployees.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.employees = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload || 'Unable to load employees.';
      })

      // fetch by id (edit)
      .addCase(fetchEmployeeById.pending, (state) => {
        state.selectedStatus = 'loading';
        state.selectedError = null;
        state.selectedEmployee = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded';
        state.selectedEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.selectedStatus = 'failed';
        state.selectedError = action.payload || 'Employee not found.';
      })

      // search by id
      .addCase(searchEmployeeById.pending, (state) => {
        state.searchStatus = 'loading';
        state.searchError = null;
        state.searchResult = null;
      })
      .addCase(searchEmployeeById.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded';
        state.searchResult = action.payload;
      })
      .addCase(searchEmployeeById.rejected, (state, action) => {
        state.searchStatus = 'not_found';
        state.searchError = action.payload || 'Employee not found.';
      })

      // add
      .addCase(addEmployee.pending, (state) => {
        state.operationStatus = 'loading';
        state.operationError = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.employees.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload || 'Unable to create employee.';
      })

      // update
      .addCase(updateEmployee.pending, (state) => {
        state.operationStatus = 'loading';
        state.operationError = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        const index = state.employees.findIndex(
          (employee) => String(employee.id) === String(action.payload.id)
        );
        if (index !== -1) {
          state.employees[index] = { ...state.employees[index], ...action.payload };
        }
        state.selectedEmployee = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload || 'Unable to update employee.';
      })

      // delete
      .addCase(deleteEmployee.pending, (state) => {
        state.operationStatus = 'loading';
        state.operationError = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.employees = state.employees.filter(
          (employee) => String(employee.id) !== String(action.payload)
        );
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload || 'Unable to delete employee.';
      });
  },
});

export const { clearSelectedEmployee, clearSearchResult, resetOperationStatus } =
  employeeSlice.actions;

export default employeeSlice.reducer;
