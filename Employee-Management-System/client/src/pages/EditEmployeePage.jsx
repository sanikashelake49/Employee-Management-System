import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import EmployeeForm from '../components/employees/EmployeeForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  fetchEmployeeById,
  updateEmployee,
  clearSelectedEmployee,
  resetOperationStatus,
} from '../features/employees/employeeSlice';
import { fetchCountries } from '../features/countries/countrySlice';

const EditEmployeePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedEmployee, selectedStatus, selectedError, operationStatus, operationError } =
    useSelector((state) => state.employees);
  const { countries, status: countriesStatus, error: countriesError } = useSelector(
    (state) => state.countries
  );

  useEffect(() => {
    dispatch(fetchEmployeeById(id));
    dispatch(fetchCountries());
    return () => {
      dispatch(clearSelectedEmployee());
      dispatch(resetOperationStatus());
    };
  }, [dispatch, id]);

  const handleSubmit = async (values) => {
    const result = await dispatch(updateEmployee({ id, employeeData: values }));
    if (updateEmployee.fulfilled.match(result)) {
      toast.success('Employee updated successfully.');
      navigate('/');
    } else {
      toast.error(result.payload || 'Unable to update employee.');
    }
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center gap-2 mb-3">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          &larr; Back
        </Link>
        <h2 className="mb-0">Edit Employee</h2>
      </div>

      {selectedStatus === 'loading' && <Loading message="Loading employee details..." />}

      {selectedStatus === 'failed' && (
        <ErrorMessage
          message={selectedError}
          onRetry={() => dispatch(fetchEmployeeById(id))}
        />
      )}

      {selectedStatus === 'succeeded' && selectedEmployee && (
        <div className="card shadow-sm">
          <div className="card-body">
            <EmployeeForm
              initialValues={selectedEmployee}
              countries={countries}
              countriesStatus={countriesStatus}
              countriesError={countriesError}
              onRetryCountries={() => dispatch(fetchCountries())}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/')}
              isSubmitting={operationStatus === 'loading'}
              submitError={operationStatus === 'failed' ? operationError : null}
              submitLabel="Update Employee"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEmployeePage;
