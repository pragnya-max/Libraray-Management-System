import React, { useState, useEffect } from 'react';

const EmployeePortal = ({ books, setBooks, employees }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [modalMode, setModalMode] = useState('borrow'); // 'borrow' | 'return'
    const [issueForm, setIssueForm] = useState({ employeeId: '', dateIssued: '', returnDate: '', actionStatus: 'Borrow' });
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [watchList, setWatchList] = useState(() => {
        try { return JSON.parse(localStorage.getItem('lms_watchlist') || '[]'); } catch { return []; }
    });
    const [newlyAvailable, setNewlyAvailable] = useState([]);

    const loggedId = localStorage.getItem('employeeId') || '';
    const currentEmployee = employees.find(e => e.idCardNo === loggedId);
    const employeeName = currentEmployee ? currentEmployee.name : loggedId;

    // Check if any watched books just became available
    useEffect(() => {
        const myWatch = watchList.filter(w => w.watcherName === employeeName);
        const available = myWatch.filter(w => {
            const book = books.find(b => b.id === w.bookId);
            return book && book.status === 'Available';
        });
        setNewlyAvailable(available);
    }, [books, watchList, employeeName]);

    // Persist watchlist
    useEffect(() => {
        localStorage.setItem('lms_watchlist', JSON.stringify(watchList));
    }, [watchList]);

    const filteredBooks = books.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.author && b.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const openBorrowModal = (book) => {
        setSelectedBook(book);
        setModalMode('borrow');
        const today = new Date().toISOString().split('T')[0];
        setIssueForm({ employeeId: loggedId, dateIssued: today, returnDate: '', actionStatus: 'Borrow' });
        setErrorMsg('');
        setShowIssueModal(true);
    };

    const openReturnModal = (book) => {
        setSelectedBook(book);
        setModalMode('return');
        const today = new Date().toISOString().split('T')[0];
        setIssueForm({ employeeId: loggedId, dateIssued: '', returnDate: today, actionStatus: 'Return' });
        setErrorMsg('');
        setShowIssueModal(true);
    };

    const handleWatchBook = (book) => {
        const already = watchList.find(w => w.bookId === book.id && w.watcherName === employeeName);
        if (already) return;
        setWatchList(prev => [...prev, { bookId: book.id, bookName: book.name, watcherName: employeeName }]);
        showSuccess(`🔔 You'll be notified when "${book.name}" becomes available!`);
    };

    const dismissNotification = (bookId) => {
        setWatchList(prev => prev.filter(w => !(w.bookId === bookId && w.watcherName === employeeName)));
        setNewlyAvailable(prev => prev.filter(w => w.bookId !== bookId));
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 5000);
    };

    const handleIssueSubmit = (e) => {
        e.preventDefault();
        if (!issueForm.employeeId) { setErrorMsg('Please enter your Employee ID.'); return; }
        if (modalMode === 'borrow' && !issueForm.dateIssued) { setErrorMsg('Please enter the issue date.'); return; }

        let newStatus = modalMode === 'borrow' ? 'Borrowed' : 'Available';
        let borrowedBy = '';
        if (modalMode === 'borrow') {
            const emp = employees.find(e => e.idCardNo === issueForm.employeeId || e.name === issueForm.employeeId);
            borrowedBy = emp ? emp.name : issueForm.employeeId;
        }

        setBooks(books.map(b => b.id === selectedBook.id ? { ...b, status: newStatus, borrowedBy } : b));
        setShowIssueModal(false);

        if (modalMode === 'return') {
            showSuccess(`✅ "${selectedBook.name}" returned successfully!`);
        } else {
            showSuccess(`✅ "${selectedBook.name}" borrowed successfully!`);
        }
    };

    const statusBadge = (status) => {
        const available = status === 'Available';
        return (
            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', backgroundColor: available ? '#c6f6d5' : '#fed7d7', color: available ? '#276749' : '#9b2c2c' }}>
                {status}
            </span>
        );
    };

    const isMyBorrow = (book) => 
        book.borrowedBy === employeeName || book.borrowedBy === loggedId;
    const isWatching = (book) => watchList.some(w => w.bookId === book.id && w.watcherName === employeeName);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Header */}
            <div style={{ backgroundColor: '#48bb78', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="36" height="36" viewBox="0 0 100 100">
                        <polygon points="50,0 100,100 0,100" fill="white" opacity="0.9" />
                        <polygon points="25,50 75,50 50,100" fill="white" opacity="0.5" />
                    </svg>
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '18px' }}>Library — Employee Portal</div>
                        <div style={{ fontSize: '12px', opacity: 0.85 }}>Welcome, {employeeName}</div>
                    </div>
                </div>
                <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('userRole'); localStorage.removeItem('employeeId'); window.location.href = '/login'; }}
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                    Logout
                </button>
            </div>

            <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>

                {/* Availability Notifications */}
                {newlyAvailable.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                        {newlyAvailable.map(w => (
                            <div key={w.bookId} style={{ backgroundColor: '#c6f6d5', border: '1px solid #68d391', borderRadius: '10px', padding: '16px 20px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '24px' }}>📬</span>
                                    <div>
                                        <strong style={{ color: '#276749', fontSize: '15px' }}>Good news! </strong>
                                        <span style={{ color: '#2f855a' }}>"{w.bookName}" is now <strong>Available</strong> — go grab it!</span>
                                    </div>
                                </div>
                                <button onClick={() => dismissNotification(w.bookId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#276749', fontSize: '18px', fontWeight: '700' }}>✕</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Success Message */}
                {successMsg && (
                    <div style={{ backgroundColor: '#ebf8ff', border: '1px solid #90cdf4', borderRadius: '8px', padding: '14px 20px', marginBottom: '24px', color: '#2b6cb0', fontWeight: '600' }}>
                        {successMsg}
                    </div>
                )}

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                    {[
                        { label: 'Total Books', value: books.length, color: '#4299e1', icon: '📚' },
                        { label: 'Available', value: books.filter(b => b.status === 'Available').length, color: '#48bb78', icon: '✅' },
                        { label: 'Borrowed', value: books.filter(b => b.status === 'Borrowed').length, color: '#f56565', icon: '📖' },
                    ].map(stat => (
                        <div key={stat.label} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '36px' }}>{stat.icon}</span>
                            <div>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                                <div style={{ color: '#718096', fontSize: '14px' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: '18px' }}>🔍</span>
                    <input type="text" placeholder="Search book by name or author..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '14px 14px 14px 44px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} />
                </div>
                <p style={{ color: '#718096', fontSize: '13px', marginBottom: '20px' }}>
                    💡 Click <strong>📖 Borrow</strong> on an available book to borrow it. Click <strong>↩ Return</strong> to return a book you borrowed. Click <strong>🔔 Notify Me</strong> to get notified when a book becomes available.
                </p>

                {/* Books Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                        <h2 style={{ margin: 0, color: '#2d3748', fontSize: '18px' }}>📚 Book Catalogue</h2>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f7fafc' }}>
                                <th style={{ textAlign: 'left', padding: '14px 20px', color: '#4a5568', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Book Name</th>
                                <th style={{ textAlign: 'left', padding: '14px 20px', color: '#4a5568', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Author</th>
                                <th style={{ textAlign: 'center', padding: '14px 20px', color: '#4a5568', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ textAlign: 'center', padding: '14px 20px', color: '#4a5568', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Borrowed By</th>
                                <th style={{ textAlign: 'center', padding: '14px 20px', color: '#4a5568', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>
                                    {searchTerm ? `No books found for "${searchTerm}"` : 'No books available.'}
                                </td></tr>
                            ) : filteredBooks.map((book, idx) => {
                                const available = book.status === 'Available';
                                const mine = isMyBorrow(book);
                                const watching = isWatching(book);
                                return (
                                    <tr key={book.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'white' : '#fafafa' }}>
                                        <td style={{ padding: '14px 20px', fontWeight: '600', color: '#2d3748' }}>{book.name}</td>
                                        <td style={{ padding: '14px 20px', color: '#718096' }}>{book.author || '-'}</td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>{statusBadge(book.status)}</td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center', color: book.borrowedBy ? (mine ? '#d69e2e' : '#e53e3e') : '#a0aec0', fontSize: '13px', fontWeight: '600' }}>
                                            {book.borrowedBy ? (mine ? `👤 You (${book.borrowedBy})` : `👤 ${book.borrowedBy}`) : '—'}
                                        </td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                {available && (
                                                    <button onClick={() => openBorrowModal(book)}
                                                        style={{ padding: '7px 14px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                        📖 Borrow
                                                    </button>
                                                )}
                                                {mine && !available && (
                                                    <button onClick={() => openReturnModal(book)}
                                                        style={{ padding: '7px 14px', backgroundColor: '#4299e1', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                        ↩ Return
                                                    </button>
                                                )}
                                                {!available && !mine && (
                                                    <button onClick={() => handleWatchBook(book)}
                                                        style={{ padding: '7px 14px', backgroundColor: watching ? '#e2e8f0' : '#fbbf24', color: watching ? '#718096' : 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                        {watching ? '🔔 Watching' : '🔔 Notify Me'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Borrow / Return Modal */}
            {showIssueModal && selectedBook && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', width: '480px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ backgroundColor: modalMode === 'return' ? '#4299e1' : '#48bb78', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>{modalMode === 'return' ? '↩ Return Book' : '📖 Borrow Book'}</h3>
                                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>{selectedBook.name}</p>
                            </div>
                            <button onClick={() => setShowIssueModal(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', borderRadius: '6px', width: '32px', height: '32px' }}>✖</button>
                        </div>
                        <form onSubmit={handleIssueSubmit} style={{ padding: '24px' }}>
                            {errorMsg && (
                                <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fc8181', color: '#c53030', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>{errorMsg}</div>
                            )}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '6px', fontWeight: '600' }}>BOOK NAME</label>
                                <input type="text" value={selectedBook.name} readOnly style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f7fafc', color: '#718096', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '6px', fontWeight: '600' }}>EMPLOYEE ID CARD NUMBER *</label>
                                <input type="text" value={issueForm.employeeId} onChange={e => setIssueForm({ ...issueForm, employeeId: e.target.value })} placeholder="e.g. EMP001"
                                    style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                {modalMode === 'borrow' && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '6px', fontWeight: '600' }}>BOOK ISSUE DATE *</label>
                                        <input type="date" value={issueForm.dateIssued} onChange={e => setIssueForm({ ...issueForm, dateIssued: e.target.value })}
                                            style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} />
                                    </div>
                                )}
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '6px', fontWeight: '600' }}>{modalMode === 'return' ? 'RETURN DATE *' : 'RETURN DATE'}</label>
                                    <input type="date" value={issueForm.returnDate} onChange={e => setIssueForm({ ...issueForm, returnDate: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '6px', fontWeight: '600' }}>STATUS</label>
                                <input type="text" value={modalMode === 'return' ? 'Return' : 'Borrow'} readOnly
                                    style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f7fafc', color: '#4a5568', boxSizing: 'border-box', fontWeight: '600' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setShowIssueModal(false)}
                                    style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', color: '#718096', cursor: 'pointer', fontWeight: '600' }}>
                                    Cancel
                                </button>
                                <button type="submit"
                                    style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', backgroundColor: modalMode === 'return' ? '#4299e1' : '#48bb78', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                                    Confirm {modalMode === 'return' ? 'Return' : 'Borrow'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeePortal;
