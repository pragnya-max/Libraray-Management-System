import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BookList from './components/BookList';
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
    { id: 1, name: '10 day mba', bookNo: 'BK001', isbn: '', author: '', publisher: '', edition: '', placeOfPublication: '', subject: 'Business', numPages: '', status: 'Borrowed', borrowedBy: 'suvam', borrowedById: 'EMP004', dateIssued: '2026-03-01', returnDate: '2026-03-15' },
    { id: 2, name: 'the power of habbit', bookNo: 'BK002', isbn: '', author: '', publisher: '', edition: '', placeOfPublication: '', subject: 'Self Help', numPages: '', status: 'Available' },
    { id: 3, name: 'the four hour work week', bookNo: 'BK003', isbn: '', author: '', publisher: '', edition: '', placeOfPublication: '', subject: 'Business', numPages: '', status: 'Available' },
    { id: 4, name: 'sapiens', bookNo: 'BK004', isbn: '', author: '', publisher: '', edition: '', placeOfPublication: '', subject: 'History', numPages: '', status: 'Borrowed', borrowedBy: 'khusi', borrowedById: 'EMP002', dateIssued: '2026-03-01', returnDate: '2026-03-15' }
];

const initialEmployees = [
    { id: 1, name: 'pooja', idCardNo: 'EMP001', contact: '', email: '', position: '', status: 'Active' },
    { id: 2, name: 'khusi', idCardNo: 'EMP002', contact: '', email: '', position: '', status: 'Active' },
    { id: 3, name: 'neha', idCardNo: 'EMP003', contact: '', email: '', position: '', status: 'Active' },
    { id: 4, name: 'suvam', idCardNo: 'EMP004', contact: '', email: '', position: '', status: 'Active' },
    { id: 5, name: 'arpita', idCardNo: 'EMP005', contact: '', email: '', position: '', status: 'Active' }
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

  // One-time migration: patch borrowed books that are missing borrowedById / dateIssued / returnDate
  useEffect(() => {
    let patched = false;
    const updatedBooks = books.map(b => {
      if (b.status === 'Borrowed' && b.borrowedBy && (!b.borrowedById || !b.dateIssued)) {
        const emp = employees.find(e => e.name === b.borrowedBy);
        patched = true;
        return {
          ...b,
          borrowedById: b.borrowedById || (emp ? emp.idCardNo : '-'),
          dateIssued: b.dateIssued || '2026-03-01',
          returnDate: b.returnDate || '2026-03-15'
        };
      }
      return b;
    });
    if (patched) setBooks(updatedBooks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isAdmin = isAuthenticated && userRole === 'admin';
  const isEmployee = isAuthenticated && userRole === 'employee';

  return (
    <Router>
      <div className="App" style={{ display: 'flex', minHeight: '100vh' }}>
        {isAdmin && <Sidebar collapsed={sidebarCollapsed} />}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f7fafc' }}>
          {isAdmin && <TopBar setAuth={(v) => handleSetAuth(v, null)} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />}

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
