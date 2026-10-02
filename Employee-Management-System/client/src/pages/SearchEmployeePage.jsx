import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EmployeeSearch from '../components/employees/EmployeeSearch';
import EmployeeTable from '../components/employees/EmployeeTable';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  searchEmployeeById,
  clearSearchResult,
} from '../features/employees/employeeSlice';

const SearchEmployeePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResult, searchStatus, searchError } = useSelector(
    (state) => state.employees
  );

  useEffect(() => {
    return () => {
      dispatch(clearSearchResult());
    };
  }, [dispatch]);

  const handleSearch = (id) => {
    dispatch(searchEmployeeById(id));
  };

  const handleClear = () => {
    dispatch(clearSearchResult());
  };

  return (
    <div className="container">
      <h2 className="mb-3">Search Employee by ID</h2>

      <EmployeeSearch
        onSearch={handleSearch}
        onClear={handleClear}
        isSearching={searchStatus === 'loading'}
      />

      {searchStatus === 'loading' && <Loading message="Searching employee..." />}

      {searchStatus === 'not_found' && (
        <ErrorMessage message={searchError || 'Employee not found.'} />
      )}

      {searchStatus === 'succeeded' && searchResult && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <EmployeeTable
              employees={[searchResult]}
              onEdit={(id) => navigate(`/employees/edit/${id}`)}
              showDelete={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchEmployeePage;
