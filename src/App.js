import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import BookList from './components/BookList';
import MemberList from './components/MemberList';
import FeeManagement from './components/FeeManagement';
import SearchBooks from './components/SearchBooks';
import AddBook from './pages/AddBook';
import IssueBook from './pages/IssueBook';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Employees from './pages/Employees';
import EmployeePortal from './pages/EmployeePortal';
import Login from './pages/Login';

// Reports
import AvailableBooksReport from './pages/reports/AvailableBooksReport';
import IssuedBooksReport from './pages/reports/IssuedBooksReport';
import EmployeesReport from './pages/reports/EmployeesReport';

import './App.css';

// Shared mock data lifted to App level so state persists across navigation
const initialBooks = [
    { id: 1, name: 'Kifo Kisimani', bookNo: 'KLB0123', isbn: '', author: 'Ken Walibora', publisher: 'East African Publisher', edition: '', placeOfPublication: 'Nairobi', subject: 'Kiswahili', numPages: '180', status: 'Borrowed', borrowedBy: 'Ken Mutiso Kivanga' },
    { id: 2, name: 'The River Between', bookNo: 'KLB0125', isbn: '', author: 'Ngugi Wathiongo', publisher: 'East African Publisher', edition: '2nd', placeOfPublication: 'Nairobi', subject: 'English', numPages: '150', status: 'Available' },
    { id: 3, name: 'KLB Kiswahili Kitukunzwe', bookNo: 'KLB0128', isbn: '', author: 'Ken Walibora', publisher: 'East African Publisher', edition: '1st', placeOfPublication: 'Nairobi', subject: 'Kiswahili', numPages: '220', status: 'Available' },
    { id: 4, name: 'KLB Business Studies Form One', bookNo: 'KLB0129', isbn: '', author: 'David Ndii', publisher: 'Jomo Kenyata Foundation Publisher', edition: '', placeOfPublication: 'Nairobi', subject: 'Business Studies', numPages: '300', status: 'Available' }
];

const initialEmployees = [
    { id: 1, name: 'Ken Mutiso Kivanga', idCardNo: 'EMP001', contact: '0745978695', email: 'ken@aveti.com', position: 'Manager', status: 'Active' },
    { id: 2, name: 'Bilal Osman', idCardNo: 'EMP002', contact: '071237868', email: 'bilal@aveti.com', position: 'Staff', status: 'Active' },
    { id: 3, name: 'Mark Namaswa', idCardNo: 'EMP003', contact: '070956843', email: 'mark@aveti.com', position: 'Staff', status: 'Active' },
    { id: 4, name: 'Salome Shitanda', idCardNo: 'EMP004', contact: '070985764', email: 'salome@aveti.com', position: 'Teacher', status: 'Active' },
    { id: 5, name: 'Sabina Chege', idCardNo: 'EMP005', contact: '070569785', email: 'sabina@aveti.com', position: 'Teacher', status: 'Active' }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' | 'employee'

  // Load from localStorage or fall back to defaults
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('lms_books');
      return saved ? JSON.parse(saved) : initialBooks;
    } catch { return initialBooks; }
  });

  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('lms_employees');
      return saved ? JSON.parse(saved) : initialEmployees;
    } catch { return initialEmployees; }
  });

  // Auto-save to localStorage whenever data changes
  useEffect(() => { localStorage.setItem('lms_books', JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem('lms_employees', JSON.stringify(employees)); }, [employees]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleSetAuth = (value, role) => {
    setIsAuthenticated(value);
    setUserRole(role || null);
    if (!value) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    }
  };

  const isAdmin = isAuthenticated && userRole === 'admin';
  const isEmployee = isAuthenticated && userRole === 'employee';

  return (
    <Router>
      <div className="App" style={{ display: 'flex', minHeight: '100vh' }}>
        {isAdmin && <Sidebar />}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f7fafc' }}>
          {isAdmin && <TopBar setAuth={(v) => handleSetAuth(v, null)} />}

          <main style={{ padding: isAdmin ? '20px' : '0' }}>
            <Routes>
              <Route path="/login" element={<Login setAuth={handleSetAuth} />} />

              {isAdmin ? (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/members" element={<Employees employees={employees} setEmployees={setEmployees} />} />
                  <Route path="/fees" element={<FeeManagement />} />
                  <Route path="/search" element={<SearchBooks />} />
                  <Route path="/add-book" element={<AddBook />} />
                  <Route path="/issue-book" element={<IssueBook />} />
                  <Route path="/books" element={<BookList books={books} setBooks={setBooks} employees={employees} />} />
                  {/* Report Routes */}
                  <Route path="/reports/available-books" element={<AvailableBooksReport books={books} />} />
                  <Route path="/reports/issued-books" element={<IssuedBooksReport books={books} />} />
                  <Route path="/reports/employees" element={<EmployeesReport employees={employees} />} />
                </>
              ) : isEmployee ? (
                <>
                  <Route path="/employee-portal" element={<EmployeePortal books={books} setBooks={setBooks} employees={employees} />} />
                  <Route path="*" element={<Navigate to="/employee-portal" />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
