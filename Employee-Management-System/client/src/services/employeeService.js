import apiClient, { EMPLOYEE_API_BASE_URL } from './apiClient';

/**
 * Thin service layer around the Employee mock API.
 * Keeping all HTTP calls in one place means components and Redux thunks
 * never talk to axios directly.
 */
const employeeService = {
  getAllEmployees: async () => {
    const response = await apiClient.get(EMPLOYEE_API_BASE_URL);
    return response.data;
  },

  getEmployeeById: async (id) => {
    const response = await apiClient.get(`${EMPLOYEE_API_BASE_URL}/${id}`);
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const response = await apiClient.post(EMPLOYEE_API_BASE_URL, employeeData);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await apiClient.put(
      `${EMPLOYEE_API_BASE_URL}/${id}`,
      employeeData
    );
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await apiClient.delete(`${EMPLOYEE_API_BASE_URL}/${id}`);
    return response.data;
  },
};

export default employeeService;
