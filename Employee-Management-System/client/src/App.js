import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/common/Navbar';
import EmployeeListPage from './pages/EmployeeListPage';
import AddEmployeePage from './pages/AddEmployeePage';
import EditEmployeePage from './pages/EditEmployeePage';
import SearchEmployeePage from './pages/SearchEmployeePage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<EmployeeListPage />} />
            <Route path="/employees/add" element={<AddEmployeePage />} />
            <Route path="/employees/edit/:id" element={<EditEmployeePage />} />
            <Route path="/employees/search" element={<SearchEmployeePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
