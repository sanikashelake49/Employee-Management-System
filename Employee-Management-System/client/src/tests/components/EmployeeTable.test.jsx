import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmployeeTable from '../../components/employees/EmployeeTable';

const employees = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@test.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune',
  },
];

describe('EmployeeTable', () => {
  it('renders employee information in a table row', () => {
    render(<EmployeeTable employees={employees} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@test.com')).toBeInTheDocument();
    expect(screen.getByText('9876543210')).toBeInTheDocument();
    expect(screen.getByText('Maharashtra')).toBeInTheDocument();
    expect(screen.getByText('Pune')).toBeInTheDocument();
  });

  it('calls onEdit with the employee id when Edit is clicked', () => {
    const onEdit = jest.fn();
    render(<EmployeeTable employees={employees} onEdit={onEdit} onDelete={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /edit jane doe/i }));

    expect(onEdit).toHaveBeenCalledWith('1');
  });

  it('calls onDelete with the employee when Delete is clicked', () => {
    const onDelete = jest.fn();
    render(<EmployeeTable employees={employees} onEdit={jest.fn()} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /delete jane doe/i }));

    expect(onDelete).toHaveBeenCalledWith(employees[0]);
  });

  it('hides the delete action when showDelete is false', () => {
    render(
      <EmployeeTable employees={employees} onEdit={jest.fn()} showDelete={false} />
    );

    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });
});
