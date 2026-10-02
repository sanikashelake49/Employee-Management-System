import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import EmployeeTable from '../components/employees/EmployeeTable';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import {
  fetchEmployees,
  deleteEmployee,
  resetOperationStatus,
} from '../features/employees/employeeSlice';

/**
 * Smart component: owns Redux state, dispatches thunks, handles
 * navigation and delegates all rendering to dumb components.
 */
const EmployeeListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { employees, listStatus, listError, operationStatus, operationError } =
    useSelector((state) => state.employees);

  const [employeePendingDelete, setEmployeePendingDelete] = useState(null);

  const loadEmployees = useCallback(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleEdit = (id) => {
    navigate(`/employees/edit/${id}`);
  };

  const handleDeleteRequest = (employee) => {
    setEmployeePendingDelete(employee);
  };

  const handleCancelDelete = () => {
    setEmployeePendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!employeePendingDelete) return;
    const result = await dispatch(deleteEmployee(employeePendingDelete.id));
    if (deleteEmployee.fulfilled.match(result)) {
      toast.success('Employee deleted successfully.');
      setEmployeePendingDelete(null);
      dispatch(resetOperationStatus());
    } else {
      toast.error(result.payload || 'Unable to delete employee.');
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="mb-0">Employees</h2>
      </div>

      {listStatus === 'loading' && <Loading message="Loading employees..." />}

      {listStatus === 'failed' && (
        <ErrorMessage message={listError} onRetry={loadEmployees} />
      )}

      {listStatus === 'succeeded' && employees.length === 0 && (
        <EmptyState
          title="No employees found."
          description="Get started by adding your first employee."
          actionTo="/employees/add"
          actionLabel="Add Employee"
        />
      )}

      {listStatus === 'succeeded' && employees.length > 0 && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <EmployeeTable
              employees={employees}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        show={Boolean(employeePendingDelete)}
        employeeName={employeePendingDelete?.name}
        isDeleting={operationStatus === 'loading'}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {operationStatus === 'failed' && operationError && (
        <div className="mt-3">
          <ErrorMessage message={operationError} />
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;
