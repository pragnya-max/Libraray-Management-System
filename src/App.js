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
import DataImport from './pages/DataImport';

// Reports
import AvailableBooksReport from './pages/reports/AvailableBooksReport';
import IssuedBooksReport from './pages/reports/IssuedBooksReport';
import EmployeesReport from './pages/reports/EmployeesReport';

import './App.css';

// Shared mock data lifted to App level so state persists across navigation
const initialBooks = [
    { id: 101, name: 'Start with Why', author: 'Simon Sinek', subject: 'Business', status: 'Available', image: '/book_coverpage/START WITH WHY.jpg' },
    { id: 102, name: 'IKIGAI', author: 'Francesc Miralles', subject: 'Self-Help', status: 'Available', image: '/book_coverpage/IKIGAI.jpg' },
    { id: 103, name: 'Secret', author: 'Rhonda Byrne', subject: 'Philosophy', status: 'Available', image: '/book_coverpage/SECRETE.jpg' },
    { id: 104, name: 'Hyperfocus: How to Work Less to Achieve More', author: 'Chris Bailey', subject: 'Productivity', status: 'Available', image: '/book_coverpage/Hyperfocus.jpg' },
    { id: 105, name: 'Zero to One', author: 'Peter Thiel', subject: 'Entrepreneurship', status: 'Available', image: '/book_coverpage/Zero to One.jpg' },
    { id: 106, name: 'Stay Hungry Stay Foolish', author: 'Rashmi Bansal', subject: 'Motivation', status: 'Available', image: '/book_coverpage/Stay Hungry Stay Foolish.jpg' },
    { id: 107, name: 'Daily Coffee & Startup Fundraising', author: 'Sarthak', subject: 'Finance', status: 'Available', image: '/book_coverpage/Daily Coffee & Startup Fundraising.jpg' },
    { id: 108, name: 'Built to Last', author: 'Collins & Porras', subject: 'Business', status: 'Available', image: '/book_coverpage/Built to Last.jpg' },
    { id: 109, name: 'The Lean Startup', author: 'Eric Ries', subject: 'Business', status: 'Available', image: '/book_coverpage/The Lean Startup.jpg' },
    { id: 110, name: 'How to Run a Company, Dennis C. Carey & Marie-Caroline', author: '', subject: 'Management', status: 'Available', image: '/book_coverpage/How to Run a Company.jpg' },
    { id: 111, name: 'The Psychology of Money', author: 'Morgan Housel', subject: 'Finance', status: 'Available', image: '/book_coverpage/The Psychology of Money.jpg' },
    { id: 112, name: 'The Compound Effect', author: 'Darren Hardy', subject: 'Self-Help', status: 'Available', image: '/book_covers/book_11.jpg' }
];

const initialEmployees = [
    { id: 1, name: 'Tofan', idCardNo: 'EMP001', contact: '983512474', email: 'tofan@gmail.com', position: 'CONTENT DEVELOPER', status: 'Active', password: '1234' },
    { id: 2, name: 'Debendra', idCardNo: 'EMP002', contact: '123456789', email: 'debendra@gmail.com', position: 'CONTENT DEVELOPER', status: 'Active', password: '1234' },
    { id: 3, name: 'Anant', idCardNo: 'EMP003', contact: '125478961', email: 'anant@gmail.com', position: 'CONTENT DEVELOPER', status: 'Active', password: '1234' },
    { id: 4, name: 'Swati', idCardNo: 'EMP004', contact: '234569745', email: 'swati@gmail.com', position: 'HR', status: 'Active', password: '1234' },
    { id: 5, name: 'Praksh', idCardNo: 'EMP005', contact: '458796512', email: 'praksh@gmail.com', position: 'SUPPORT', status: 'Active', password: '1234' },
    { id: 6, name: 'Suvendra', idCardNo: 'EMP006', contact: '321456975', email: 'suvendra@gmail.com', position: 'IT', status: 'Active', password: '1234' },
    { id: 7, name: 'Arpita', idCardNo: 'EMP007', contact: '145879652', email: 'arpita@gmail.com', position: 'IT', status: 'Active', password: '1234' },
    { id: 8, name: 'Monalisha', idCardNo: 'EMP008', contact: '142578962', email: 'monalisha@gmail.com', position: 'SUPPORT', status: 'Active', password: '1234' },
    { id: 9, name: 'Gopinath', idCardNo: 'EMP009', contact: '145875236', email: 'gopinath@gmail.com', position: 'SUPPORT', status: 'Active', password: '1234' },
    { id: 10, name: 'Manosmita', idCardNo: 'EMP010', contact: '145789654', email: 'manosmita@gmail.com', position: 'SUPPORT', status: 'Active', password: '1234' }
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

  // One-time migration: patch books with images if missing
  useEffect(() => {
    let patched = false;
    const updatedBooks = books.map((b, idx) => {
      // Patch borrowed data
      let currentBook = { ...b };
      if (b.status === 'Borrowed' && b.borrowedBy && (!b.borrowedById || !b.dateIssued)) {
        const emp = employees.find(e => e.name === b.borrowedBy);
        patched = true;
        currentBook = {
          ...currentBook,
          borrowedById: b.borrowedById || (emp ? emp.idCardNo : '-'),
          dateIssued: b.dateIssued || '2026-03-01',
          returnDate: b.returnDate || '2026-03-15'
        };
      }
      
      // Map new high-quality coverpages if name matches
      const nameMap = {
        'Start with Why': '/book_coverpage/START WITH WHY.jpg',
        'IKIGAI': '/book_coverpage/IKIGAI.jpg',
        'Secret': '/book_coverpage/SECRETE.jpg',
        'Hyperfocus: How to Work Less to Achieve More': '/book_coverpage/Hyperfocus.jpg',
        'Zero to One': '/book_coverpage/Zero to One.jpg',
        'Stay Hungry Stay Foolish': '/book_coverpage/Stay Hungry Stay Foolish.jpg',
        'Daily Coffee & Startup Fundraising': '/book_coverpage/Daily Coffee & Startup Fundraising.jpg',
        'Built to Last': '/book_coverpage/Built to Last.jpg',
        'The Lean Startup': '/book_coverpage/The Lean Startup.jpg',
        'How to Run a Company, Dennis C. Carey & Marie-Caroline': '/book_coverpage/How to Run a Company.jpg',
        'The Psychology of Money': '/book_coverpage/The Psychology of Money.jpg'
      };

      if (nameMap[b.name]) {
        if (currentBook.image !== nameMap[b.name]) {
            patched = true;
            currentBook.image = nameMap[b.name];
        }
      } else if (!b.image && idx < 61) {
        // Fallback for others
        patched = true;
        currentBook = {
          ...currentBook,
          image: `/book_covers/book_${idx}.jpg`
        };
      }
      return currentBook;
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
              <Route path="/login" element={<Login setAuth={handleSetAuth} employees={employees} />} />

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
                  <Route path="/import" element={<DataImport books={books} setBooks={setBooks} employees={employees} setEmployees={setEmployees} />} />
                  {/* Report Routes */}
                  <Route path="/reports/available-books" element={<AvailableBooksReport books={books} />} />
                  <Route path="/reports/issued-books" element={<IssuedBooksReport books={books} />} />
                  <Route path="/reports/employees" element={<EmployeesReport employees={employees} />} />
                </>
              ) : isEmployee ? (
                <>
                  <Route path="/employee-portal" element={<EmployeePortal books={books} setBooks={setBooks} employees={employees} setEmployees={setEmployees} />} />
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
