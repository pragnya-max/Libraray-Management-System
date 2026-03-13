import React, { useState } from 'react';

const BookList = ({ books, setBooks, employees = [] }) => {
    const [showNewModal, setShowNewModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;

    // States for Editing/Viewing/Issuing
    const [editingBook, setEditingBook] = useState(null);
    const [issuingBook, setIssuingBook] = useState(null);

    // Form state for new/edit book
    const [newBook, setNewBook] = useState({
        name: '', isbn: '', author: '', status: 'Available', image: ''
    });

    // Form state for issue book
    const [issueData, setIssueData] = useState({
        employeeId: '', dateIssued: '', returnDate: '', actionStatus: 'Borrow'
    });

    const handleBookInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    const handleIssueInputChange = (e) => {
        const { name, value } = e.target;
        setIssueData({ ...issueData, [name]: value });
    };

    const handleOpenEdit = (book, viewOnly = false) => {
        setEditingBook(book);
        setNewBook({ ...book });
        setIsViewMode(viewOnly);
        setShowNewModal(true);
    };

    const handleOpenNew = () => {
        setEditingBook(null);
        setNewBook({ name: '', isbn: '', author: '', status: 'Available' });
        setIsViewMode(false);
        setShowNewModal(true);
    };

    const handleOpenIssue = (book) => {
        setIssuingBook(book);
        const today = new Date().toISOString().split('T')[0];
        setIssueData({
            employeeId: '', dateIssued: today, returnDate: '', actionStatus: book.status === 'Available' ? 'Borrow' : 'Return'
        });
        setShowIssueModal(true);
    };

    const handleDelete = (id) => {
        setBooks(books.filter(b => b.id !== id));
    };

    const handleAddOrEditBook = () => {
        if (!newBook.name) return; 
        
        if (editingBook && !isViewMode) {
            setBooks(books.map(b => b.id === editingBook.id ? { ...b, ...newBook } : b));
        } else if (!isViewMode) {
            const bookToAdd = {
                id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
                ...newBook,
                status: 'Available'
            };
            setBooks([...books, bookToAdd]);
        }
        setShowNewModal(false);
    };

    const handleIssueSubmit = () => {
        let newStatus = issuingBook.status;
        let borrowedBy = issuingBook.borrowedBy || '';
        let borrowedById = issuingBook.borrowedById || '';
        let dateIssued = issuingBook.dateIssued || '';
        let returnDate = issuingBook.returnDate || '';

        if (issueData.actionStatus === 'Borrow') {
            newStatus = 'Borrowed';
            // Look up name from employees list, fall back to entered ID
            const emp = employees.find(e => e.idCardNo === issueData.employeeId || e.name === issueData.employeeId);
            borrowedBy = emp ? emp.name : issueData.employeeId;
            borrowedById = emp ? emp.idCardNo : issueData.employeeId;
            dateIssued = issueData.dateIssued;
            returnDate = issueData.returnDate;
        }
        if (issueData.actionStatus === 'Return') {
            newStatus = 'Available';
            borrowedBy = '';
            borrowedById = '';
            dateIssued = '';
            returnDate = '';
        }
        if (issueData.actionStatus === 'Lost') {
            newStatus = 'Lost';
            borrowedBy = '';
            borrowedById = '';
            dateIssued = '';
            returnDate = '';
        }

        setBooks(books.map(b => b.id === issuingBook.id ? { ...b, status: newStatus, borrowedBy, borrowedById, dateIssued, returnDate } : b));
        setShowIssueModal(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={handleOpenNew}
                style={{
                    backgroundColor: '#4299e1',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                NEW BOOK
            </button>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search book name or author...."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}
            />

            {/* Books Table */}
            <div style={{ backgroundColor: 'white', borderTop: '2px solid #e2e8f0', borderBottom: '2px solid #e2e8f0' }}>
                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', backgroundColor: 'white', color: '#4a5568' }}>BOOK NAME</th>
                            <th style={{ textAlign: 'left', backgroundColor: 'white', color: '#4a5568' }}>AUTHOR</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568' }}>BORROWED BY</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568' }}>STATUS</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const filtered = books.filter(b => 
                                b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                b.author.toLowerCase().includes(searchTerm.toLowerCase())
                            );
                            const indexOfLastBook = currentPage * booksPerPage;
                            const indexOfFirstBook = indexOfLastBook - booksPerPage;
                            const currentBooks = filtered.slice(indexOfFirstBook, indexOfLastBook);

                            if (currentBooks.length === 0) {
                                return <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#718096' }}>No books found.</td></tr>;
                            }

                            return currentBooks.map((b, idx) => (
                                <tr key={b.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#f7fafc' : '#ffffff' }}>
                                    <td style={{ textAlign: 'left' }}>{b.name}</td>
                                    <td style={{ textAlign: 'left', color: '#718096' }}>{b.author}</td>
                                    <td style={{ textAlign: 'center', fontWeight: '600', color: b.borrowedBy ? '#e53e3e' : '#48bb78' }}>
                                        {b.borrowedBy ? `👤 ${b.borrowedBy}` : '✅ Available'}
                                    </td>
                                    <td style={{ textAlign: 'center', color: b.status === 'Available' ? '#48bb78' : '#f56565' }}>{b.status}</td>
                                    <td style={{ textAlign: 'center', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                        <button onClick={() => handleOpenEdit(b, false)} title="Edit Book" style={{ backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', width: '28px' }}>✎</button>
                                        <button onClick={() => handleOpenEdit(b, true)} title="View Book" style={{ backgroundColor: '#48bb78', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', width: '28px' }}>👁</button>
                                        <button onClick={() => handleOpenIssue(b)} title="Issue/Return Book" style={{ backgroundColor: '#9f7aea', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', width: '28px' }}>📖</button>
                                        <button onClick={() => handleDelete(b.id)} title="Delete Book" style={{ backgroundColor: '#f56565', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', width: '28px' }}>✖</button>
                                    </td>
                                </tr>
                            ));
                        })()}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {(() => {
                const filtered = books.filter(b => 
                    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    b.author.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const totalPages = Math.ceil(filtered.length / booksPerPage);
                if (totalPages <= 1) return null;

                return (
                    <div style={{ display: 'flex', gap: '5px', marginTop: '20px' }}>
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            style={{ padding: '5px 10px', border: '1px solid #e2e8f0', backgroundColor: currentPage === 1 ? '#f7fafc' : 'white', cursor: currentPage === 1 ? 'default' : 'pointer' }}
                        >«</button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                style={{ 
                                    padding: '5px 10px', 
                                    border: '1px solid #e2e8f0', 
                                    cursor: 'pointer', 
                                    color: currentPage === i + 1 ? 'white' : '#718096', 
                                    backgroundColor: currentPage === i + 1 ? '#4299e1' : 'white' 
                                }}
                            >{i + 1}</button>
                        ))}
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            style={{ padding: '5px 10px', border: '1px solid #e2e8f0', backgroundColor: currentPage === totalPages ? '#f7fafc' : 'white', cursor: currentPage === totalPages ? 'default' : 'pointer' }}
                        >»</button>
                    </div>
                );
            })()}

            {/* ADDNEW BOOK / EDIT BOOK Modal */}
            {showNewModal && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '50px', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'white', width: '600px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                        <div style={{ backgroundColor: '#4299e1', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#4a5568', fontSize: '16px' }}>{isViewMode ? 'VIEW BOOK' : (editingBook ? 'EDIT BOOK' : 'ADDNEW BOOK')}</h3>
                            <button onClick={() => setShowNewModal(false)} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#4a5568' }}>✖</button>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Book Name:</label>
                                <input name="name" value={newBook.name} onChange={handleBookInputChange} disabled={isViewMode} type="text" autoComplete="off" placeholder="Business Studies" style={{ width: '100%', padding: '10px', border: '1px solid #90cdf4', borderRadius: '4px', outline: 'none', backgroundColor: isViewMode ? '#f7fafc' : 'white' }} />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>ISBN Number:</label>
                                <input name="isbn" value={newBook.isbn} onChange={handleBookInputChange} disabled={isViewMode} type="text" autoComplete="off" style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: isViewMode ? '#f7fafc' : 'white' }} />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Author Name:</label>
                                <input name="author" value={newBook.author} onChange={handleBookInputChange} disabled={isViewMode} type="text" autoComplete="off" style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: isViewMode ? '#f7fafc' : 'white' }} />
                            </div>

                            {!isViewMode && (
                                <div style={{ textAlign: 'right' }}>
                                    <button onClick={handleAddOrEditBook} style={{ backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        {editingBook ? 'UPDATE BOOK' : 'ADD BOOK'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ISSUE BOOK Modal matching screenshot */}
            {showIssueModal && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '50px', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'white', width: '500px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                        <div style={{ backgroundColor: '#4299e1', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#4a5568', fontSize: '16px' }}>ISSUE / RETURN BOOK</h3>
                            <button onClick={() => setShowIssueModal(false)} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#4a5568' }}>✖</button>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Book Number:</label>
                                    <input type="text" value={issuingBook?.bookNo || ''} readOnly style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f7fafc', color: '#a0aec0' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Employee ID:</label>
                                    <input type="text" name="employeeId" value={issueData.employeeId} onChange={handleIssueInputChange} placeholder="EMP001" style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Date Issued:</label>
                                    <input type="date" name="dateIssued" value={issueData.dateIssued} onChange={handleIssueInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', color: '#4a5568' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Return Date (optional):</label>
                                    <input type="date" name="returnDate" value={issueData.returnDate} onChange={handleIssueInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', color: '#4a5568' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '30px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Status:</label>
                                    <select name="actionStatus" value={issueData.actionStatus} onChange={handleIssueInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #90cdf4', borderRadius: '4px', color: '#4a5568', outline: 'none' }}>
                                        <option value="Borrow">Borrow</option>
                                        <option value="Return">Return</option>
                                        <option value="Lost">Lost</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <button onClick={handleIssueSubmit} style={{ backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>SUBMIT</button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BookList;
