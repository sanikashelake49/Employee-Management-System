import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import EmployeeForm from '../components/employees/EmployeeForm';
import { addEmployee, resetOperationStatus } from '../features/employees/employeeSlice';
import { fetchCountries } from '../features/countries/countrySlice';

const AddEmployeePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { operationStatus, operationError } = useSelector((state) => state.employees);
  const { countries, status: countriesStatus, error: countriesError } = useSelector(
    (state) => state.countries
  );

  useEffect(() => {
    dispatch(fetchCountries());
    return () => {
      dispatch(resetOperationStatus());
    };
  }, [dispatch]);

  const handleSubmit = async (values) => {
    const result = await dispatch(addEmployee(values));
    if (addEmployee.fulfilled.match(result)) {
      toast.success('Employee created successfully.');
      navigate('/');
    } else {
      toast.error(result.payload || 'Unable to create employee.');
    }
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center gap-2 mb-3">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          &larr; Back
        </Link>
        <h2 className="mb-0">Add Employee</h2>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <EmployeeForm
            countries={countries}
            countriesStatus={countriesStatus}
            countriesError={countriesError}
            onRetryCountries={() => dispatch(fetchCountries())}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
            isSubmitting={operationStatus === 'loading'}
            submitError={operationStatus === 'failed' ? operationError : null}
            submitLabel="Add Employee"
          />
        </div>
      </div>
    </div>
  );
};

export default AddEmployeePage;
