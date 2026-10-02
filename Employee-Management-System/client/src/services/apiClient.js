import axios from 'axios';

/**
 * Base URLs are configurable through environment variables so the app
 * is not hard-wired to a single mock API instance.
 *
 * Create React App only exposes environment variables prefixed with
 * REACT_APP_, so that convention is used here (see .env.example).
 */
export const EMPLOYEE_API_BASE_URL =
  process.env.REACT_APP_EMPLOYEE_API_URL ||
  'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee';

export const COUNTRY_API_BASE_URL =
  process.env.REACT_APP_COUNTRY_API_URL ||
  'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/country';

const apiClient = axios.create({
  timeout: 15000,
});

/**
 * Normalizes any axios error into a plain, user-friendly message string.
 * Used by the thunks so Redux state never has to store raw error/axios
 * objects (which are not serializable and not useful for the UI).
 */
export const extractErrorMessage = (error, fallbackMessage) => {
  if (error?.response) {
    // Server responded with a status code outside the 2xx range.
    const serverMessage =
      error.response.data?.message || error.response.data?.error;
    if (serverMessage) return serverMessage;
    if (error.response.status === 404) return 'Requested resource was not found.';
    return `Request failed with status ${error.response.status}.`;
  }
  if (error?.request) {
    // Request was made but no response was received (network error).
    return 'Network error. Please check your connection and try again.';
  }
  return error?.message || fallbackMessage || 'Something went wrong. Please try again.';
};

export default apiClient;
