import React from 'react';

/**
 * Dumb component: purely presentational. Receives employees and
 * callbacks, has no knowledge of Redux or the API.
 */
const EmployeeTable = ({ employees, onEdit, onDelete, showDelete = true }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col">Employee ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Mobile</th>
            <th scope="col">Country</th>
            <th scope="col">State</th>
            <th scope="col">District</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobile}</td>
              <td>{employee.country}</td>
              <td>{employee.state}</td>
              <td>{employee.district}</td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-info text-white"
                    aria-label={`Edit ${employee.name}`}
                    onClick={() => onEdit(employee.id)}
                  >
                    Edit
                  </button>
                  {showDelete && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      aria-label={`Delete ${employee.name}`}
                      onClick={() => onDelete(employee)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
