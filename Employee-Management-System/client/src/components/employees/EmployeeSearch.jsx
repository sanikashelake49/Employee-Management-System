import React, { useState } from 'react';

const EmployeeSearch = ({ onSearch, onClear, isSearching }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedId = employeeId.trim();
    if (!trimmedId) {
      setValidationError('Please enter an employee ID to search.');
      return;
    }
    setValidationError('');
    onSearch(trimmedId);
  };

  const handleClear = () => {
    setEmployeeId('');
    setValidationError('');
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-wrap align-items-start gap-2 mb-3"
      role="search"
      aria-label="Search employee by ID"
    >
      <div className="flex-grow-1" style={{ minWidth: '200px' }}>
        <label htmlFor="employeeIdSearch" className="visually-hidden">
          Employee ID
        </label>
        <input
          id="employeeIdSearch"
          type="text"
          className={`form-control${validationError ? ' is-invalid' : ''}`}
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
          aria-invalid={Boolean(validationError)}
        />
        {validationError && (
          <div className="invalid-feedback d-block">{validationError}</div>
        )}
      </div>
      <button type="submit" className="btn btn-primary" disabled={isSearching}>
        {isSearching ? 'Searching...' : 'Search'}
      </button>
      <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>
        Clear
      </button>
    </form>
  );
};

export default EmployeeSearch;
