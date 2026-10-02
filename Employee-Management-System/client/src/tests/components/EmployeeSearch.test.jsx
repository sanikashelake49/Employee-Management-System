import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmployeeSearch from '../../components/employees/EmployeeSearch';

describe('EmployeeSearch', () => {
  it('shows a validation message when searching with an empty id', () => {
    const onSearch = jest.fn();
    render(<EmployeeSearch onSearch={onSearch} onClear={jest.fn()} isSearching={false} />);

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(
      screen.getByText('Please enter an employee ID to search.')
    ).toBeInTheDocument();
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('calls onSearch with the trimmed employee id', () => {
    const onSearch = jest.fn();
    render(<EmployeeSearch onSearch={onSearch} onClear={jest.fn()} isSearching={false} />);

    fireEvent.change(screen.getByPlaceholderText('Enter Employee ID'), {
      target: { value: '  5  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('5');
  });

  it('shows a loading label while searching', () => {
    render(<EmployeeSearch onSearch={jest.fn()} onClear={jest.fn()} isSearching={true} />);
    expect(screen.getByRole('button', { name: /searching/i })).toBeDisabled();
  });

  it('calls onClear and resets the input when Clear is clicked', () => {
    const onClear = jest.fn();
    render(<EmployeeSearch onSearch={jest.fn()} onClear={onClear} isSearching={false} />);

    const input = screen.getByPlaceholderText('Enter Employee ID');
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));

    expect(onClear).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });
});
