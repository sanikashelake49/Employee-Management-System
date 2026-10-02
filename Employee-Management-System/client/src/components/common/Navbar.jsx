import React from 'react';
import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `nav-link${isActive ? ' active fw-semibold' : ''}`;

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4" aria-label="Main navigation">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          Employee Management
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/" end className={linkClass}>
                Employees
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/employees/search" className={linkClass}>
                Search
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/employees/add" className={linkClass}>
                Add Employee
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
