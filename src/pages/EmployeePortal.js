import React, { useState, useEffect } from 'react';

const EmployeePortal = ({ books, setBooks, employees }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [currentPageTable, setCurrentPageTable] = useState(1);
    const [booksPerPage] = useState(10);
    const [modalMode, setModalMode] = useState('borrow'); // 'borrow' | 'return'
    const [issueForm, setIssueForm] = useState({ employeeId: '', dateIssued: '', returnDate: '', actionStatus: 'Borrow' });
    const [successMsg, setSuccessMsg] = useState('');
    const [carouselPage, setCarouselPage] = useState(0); // 0 or 1
    const [errorMsg, setErrorMsg] = useState('');
    const [watchList, setWatchList] = useState(() => {
        try { return JSON.parse(localStorage.getItem('lms_watchlist') || '[]'); } catch { return []; }
    });
    const [newlyAvailable, setNewlyAvailable] = useState([]);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [securityMsg] = useState({ text: '', type: '' });
    
    

    const loggedId = localStorage.getItem('employeeId') || '';
    const currentEmployee = employees.find(e => e.idCardNo === loggedId);
    const employeeName = currentEmployee ? currentEmployee.name : loggedId;

    useEffect(() => {
        const myWatch = watchList.filter(w => w.watcherName === employeeName);
        const available = myWatch.filter(w => {
            const book = books.find(b => b.id === w.bookId);
            return book && book.status === 'Available';
        });
        setNewlyAvailable(available);
    }, [books, watchList, employeeName]);

    useEffect(() => {
        localStorage.setItem('lms_watchlist', JSON.stringify(watchList));
    }, [watchList]);

    const filteredBooks = books.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.author && b.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Separate books by status for rows
    const availableBooks = filteredBooks.filter(b => b.status === 'Available');
    const myBorrowedBooks = filteredBooks.filter(b => b.borrowedBy === employeeName || b.borrowedBy === loggedId);

    const openBorrowModal = (book) => {
        console.log("Opening Borrow Modal for:", book.name);
        setSelectedBook(book);
        setModalMode('borrow');
        const today = new Date().toISOString().split('T')[0];
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 14);
        setIssueForm({ employeeId: loggedId, dateIssued: today, returnDate: returnDate.toISOString().split('T')[0], actionStatus: 'Borrow' });
        setErrorMsg('');
        setShowIssueModal(true);
    };

    const openReturnModal = (book) => {
        console.log("Opening Return Modal for:", book.name);
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
        if (modalMode === 'borrow' && !issueForm.returnDate) { setErrorMsg('Please enter the expected return date.'); return; }

        let newStatus = modalMode === 'borrow' ? 'Borrowed' : 'Available';
        let borrowedBy = '';
        let borrowedById = '';
        let dateIssued = '';
        let returnDate = '';

        if (modalMode === 'borrow') {
            borrowedBy = employeeName;
            borrowedById = loggedId;
            dateIssued = issueForm.dateIssued;
            
            // Default 14 days for return if not specified
            if (!issueForm.returnDate) {
                const d = new Date(dateIssued);
                d.setDate(d.getDate() + 14);
                returnDate = d.toISOString().split('T')[0];
            } else {
                returnDate = issueForm.returnDate;
            }
        }

        setBooks(books.map(b => b.id === selectedBook.id ? { 
            ...b, 
            status: newStatus, 
            borrowedBy,
            borrowedById,
            dateIssued,
            returnDate
        } : b));
        
        setShowIssueModal(false);

        if (modalMode === 'return') {
            showSuccess(`✅ "${selectedBook.name}" returned successfully!`);
        } else {
            showSuccess(`✅ "${selectedBook.name}" borrowed successfully!`);
        }
    };

    const isMyBorrow = (book) => 
        book.borrowedBy === employeeName || book.borrowedBy === loggedId;

    const isWatching = (book) => watchList.some(w => w.bookId === book.id && w.watcherName === employeeName);

    const handlePasswordUpdate = (e) => {
        // ... (existing code)
    };

    const scrollCarousel = (direction) => {
        if (direction === 'left') {
            setCarouselPage(0);
        } else {
            setCarouselPage(1);
        }
    };

    

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#141414', color: '#fff', fontFamily: "'Segoe UI', sans-serif", overflowX: 'hidden' }}>

            {/* Netflix-style Navbar */}
            <div style={{ 
                position: 'fixed', top: 0, width: '100%', zIndex: 100,
                backgroundColor: 'rgba(20,20,20,0.95)', padding: '15px 4%', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxSizing: 'border-box'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <svg width="24" height="24" viewBox="0 0 100 100">
                            <polygon points="50,0 100,100 0,100" fill="#48bb78" />
                            <polygon points="25,50 75,50 50,100" fill="#c6f6d5" />
                        </svg>
                        <span style={{ color: '#48bb78', fontSize: '20px', fontWeight: 'bold' }}>LIBRARY</span>
                    </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <input type="text" placeholder="Titles, authors" value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ 
                                padding: '6px 10px 6px 30px', backgroundColor: 'rgba(0,0,0,0.7)', 
                                border: '1px solid #48bb78', color: 'white', outline: 'none', 
                                width: searchTerm ? '250px' : '150px', transition: 'width 0.4s ease'
                            }} 
                        />
                        <span style={{ position: 'absolute', left: '8px', top: '5px', fontSize: '14px' }}>🔍</span>
                    </div>
                    <span style={{ fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowSecurityModal(true)}>
                        Security Settings
                    </span>
                    <span style={{ fontSize: '14px' }}>{employeeName}</span>
                    <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('userRole'); localStorage.removeItem('employeeId'); window.location.href = '/login'; }}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' }}>
                        Sign out
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ paddingTop: '100px', paddingBottom: '50px' }}>

                {/* Notifications */}
                <div style={{ padding: '0 4%' }}>
                    {newlyAvailable.map(w => (
                        <div key={w.bookId} style={{ backgroundColor: '#2f855a', color: 'white', borderRadius: '4px', padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div><strong>Available Now:</strong> "{w.bookName}" — ready to borrow!</div>
                            <button onClick={() => dismissNotification(w.bookId)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer' }}>✖</button>
                        </div>
                    ))}
                    {successMsg && (
                        <div style={{ backgroundColor: '#2f855a', color: 'white', borderRadius: '4px', padding: '16px 20px', marginBottom: '20px' }}>
                            {successMsg}
                        </div>
                    )}
                </div>

                {/* Available Books (Trending Now style) */}
                <div style={{ marginBottom: '50px' }}>
                    <h2 style={{ padding: '0 4%', fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
                        Available Books
                    </h2>
                    
                    <div style={{ position: 'relative' }}>
                        {/* Outer Container for Clipping */}
                        <div style={{ overflow: 'hidden', padding: '0 4% 50px', maxWidth: '1350px', margin: '0 auto' }}>
                            {/* Inner Sliding Container */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '30px', 
                                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: `translateX(calc(${carouselPage * -100}% - ${carouselPage * 30}px))`,
                                justifyContent: 'flex-start'
                            }}>
                                {availableBooks.slice(0, 12).map((book, idx) => (
                                    <div key={book.id} style={{ position: 'relative', width: '200px', height: '320px', flexShrink: 0, cursor: 'pointer', transition: 'transform 0.3s' }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05) translateY(-10px)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                                        onClick={() => openBorrowModal(book)}
                                    >
                                        {/* Standalone Book Cover */}
                                        <div 
                                            onClick={(e) => { e.stopPropagation(); openBorrowModal(book); }}
                                            style={{ 
                                                width: '100%', height: '100%', backgroundColor: '#2b2b2b', borderRadius: '4px', 
                                                display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.5)', zIndex: 1, position: 'relative',
                                                textAlign: 'center', padding: '15px', boxSizing: 'border-box',
                                                border: '1px solid #333'
                                            }}
                                        >
                                            <div style={{ width: '100%', height: '200px', marginBottom: '12px', overflow: 'hidden', borderRadius: '4px', backgroundColor: '#141414' }}>
                                                {book.image ? (
                                                    <img src={book.image} alt={book.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ fontSize: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>📚</div>
                                                )}
                                            </div>
                                            <div style={{ width: '100%' }}>
                                                <h3 style={{ 
                                                    margin: '0 0 5px 0', 
                                                    fontSize: '15px', 
                                                    color: '#fff',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    lineHeight: '1.3',
                                                    height: '40px'
                                                }}>
                                                    {book.name}
                                                </h3>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#a3a3a3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {book.author}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {availableBooks.length === 0 && <p style={{ color: '#a3a3a3' }}>No available books matching your search.</p>}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <div onClick={() => scrollCarousel('left')} style={{ position: 'absolute', left: 0, top: 0, bottom: '50px', width: '4%', backgroundColor: 'rgba(20,20,20,0.7)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '30px', color: 'white', visibility: carouselPage === 0 ? 'hidden' : 'visible' }}>
                            ‹
                        </div>
                        <div onClick={() => scrollCarousel('right')} style={{ position: 'absolute', right: 0, top: 0, bottom: '50px', width: '4%', backgroundColor: 'rgba(20,20,20,0.7)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '30px', color: 'white', visibility: carouselPage === 1 || availableBooks.length <= 6 ? 'hidden' : 'visible' }}>
                            ›
                        </div>
                    </div>
                </div>

                {/* My Borrowed List */}
                {myBorrowedBooks.length > 0 && (
                    <div style={{ marginBottom: '50px' }}>
                        <h2 style={{ padding: '0 4%', fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
                            My Borrowed Books
                        </h2>
                        <div style={{ 
                            display: 'flex', gap: '20px', padding: '0 4%', flexWrap: 'wrap',
                            maxHeight: '400px', overflowY: 'auto', paddingBottom: '20px'
                        }}>
                            {myBorrowedBooks.map(book => (
                                <div key={book.id} style={{ width: '220px', backgroundColor: '#2b2b2b', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
                                     onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                     onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                     onClick={() => openReturnModal(book)}
                                >
                                    <div style={{ height: '120px', backgroundColor: '#1f1f1f', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                        {book.image ? (
                                            <img src={book.image} alt={book.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: '40px' }}>📖</span>
                                        )}
                                    </div>
                                    <div style={{ padding: '15px' }}>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{book.name}</h4>
                                        <button style={{ backgroundColor: '#2f855a', color: 'white', border: 'none', padding: '5px 10px', fontSize: '12px', borderRadius: '2px', cursor: 'pointer' }}>
                                            Return Book
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Original Stats Cards (Reference Style) */}
                <div style={{ 
                    display: 'flex', gap: '20px', padding: '0 4%', marginBottom: '40px', 
                    justifyContent: 'center', flexWrap: 'wrap' 
                }}>
                    <div style={{ backgroundColor: '#fff', color: '#333', padding: '20px', borderRadius: '8px', minWidth: '250px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '30px', backgroundColor: '#e2e8f0', padding: '10px', borderRadius: '8px' }}>📚</div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2b6cb0' }}>{books.length}</div>
                            <div style={{ fontSize: '14px', color: '#718096' }}>Total Books</div>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#fff', color: '#333', padding: '20px', borderRadius: '8px', minWidth: '250px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '30px', backgroundColor: '#f0fff4', padding: '10px', borderRadius: '8px' }}>✅</div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2f855a' }}>{books.filter(b => b.status === 'Available').length}</div>
                            <div style={{ fontSize: '14px', color: '#718096' }}>Available</div>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#fff', color: '#333', padding: '20px', borderRadius: '8px', minWidth: '250px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '30px', backgroundColor: '#fdf2f2', padding: '10px', borderRadius: '8px' }}>📖</div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#c53030' }}>{books.filter(b => b.status === 'Borrowed').length}</div>
                            <div style={{ fontSize: '14px', color: '#718096' }}>Borrowed</div>
                        </div>
                    </div>
                </div>

                {/* Search Bar matching reference image */}
                <div style={{ padding: '0 4%', marginBottom: '40px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '15px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <span style={{ fontSize: '18px' }}>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search book by name or author..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ border: 'none', width: '100%', outline: 'none', fontSize: '16px', color: '#333' }}
                        />
                    </div>
                    <p style={{ color: '#a3a3a3', fontSize: '14px', marginTop: '10px' }}>
                        💡 Click 📖 <strong>Borrow</strong> on an available book to borrow it. Click ↩ <strong>Return</strong> to return a book you borrowed. Click 🔔 <strong>Notify Me</strong> to get notified when a book becomes available.
                    </p>
                </div>

                {/* Unavailable / All Books Catalog (Original Style) */}
                <div style={{ padding: '0 4%', marginBottom: '50px' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #edf2f7', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>📚</span>
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#2d3748' }}>Book Catalogue</h2>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f7fafc', color: '#4a5568', fontSize: '12px', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '15px 20px' }}>Book Name</th>
                                        <th style={{ padding: '15px 20px' }}>Author</th>
                                        <th style={{ padding: '15px 20px' }}>Status</th>
                                        <th style={{ padding: '15px 20px' }}>Borrowed By</th>
                                        <th style={{ padding: '15px 20px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        const indexOfLastBookTable = currentPageTable * booksPerPage;
                                        const indexOfFirstBookTable = indexOfLastBookTable - booksPerPage;
                                        const currentTableBooks = filteredBooks.slice(indexOfFirstBookTable, indexOfLastBookTable);

                                        if (currentTableBooks.length === 0) {
                                            return <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>No books found matching your search.</td></tr>;
                                        }

                                        return currentTableBooks.map(book => {
                                            const watching = isWatching(book);
                                            const myBorrow = isMyBorrow(book);
                                            return (
                                                <tr key={book.id} style={{ borderBottom: '1px solid #edf2f7', color: '#2d3748', fontSize: '14px' }}>
                                                    <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>{book.name}</td>
                                                    <td style={{ padding: '15px 20px' }}>{book.author || '-'}</td>
                                                    <td style={{ padding: '15px 20px' }}>
                                                        <span style={{ 
                                                            padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                                                            backgroundColor: book.status === 'Available' ? '#f0fff4' : '#fff5f5',
                                                            color: book.status === 'Available' ? '#2f855a' : '#c53030'
                                                        }}>
                                                            {book.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '15px 20px' }}>
                                                        {book.status === 'Borrowed' ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                <span style={{ fontSize: '12px' }}>👤</span>
                                                                <span style={{ color: myBorrow ? '#2f855a' : '#c53030' }}>{book.borrowedBy || 'Unknown'}</span>
                                                            </div>
                                                        ) : '-'}
                                                    </td>
                                                    <td style={{ padding: '15px 20px' }}>
                                                        {book.status === 'Available' ? (
                                                            <button onClick={() => openBorrowModal(book)} style={{ backgroundColor: '#38a169', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                📖 Borrow
                                                            </button>
                                                        ) : myBorrow ? (
                                                            <button onClick={() => openReturnModal(book)} style={{ backgroundColor: '#2b6cb0', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                ↩ Return
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => handleWatchBook(book)} style={{ backgroundColor: watching ? '#cbd5e0' : '#ecc94b', color: watching ? '#4a5568' : '#744210', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                {watching ? 'Watching' : '🔔 Notify Me'}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        });
                                    })()}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination for Table */}
                        {filteredBooks.length > booksPerPage && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', paddingBottom: '20px' }}>
                                <button 
                                    disabled={currentPageTable === 1}
                                    onClick={() => setCurrentPageTable(prev => Math.max(prev - 1, 1))}
                                    style={{ padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #cbd5e0', borderRadius: '4px', cursor: currentPageTable === 1 ? 'default' : 'pointer', color: '#4a5568', fontWeight: 'bold' }}
                                >Previous</button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#4a5568', fontWeight: 'bold' }}>
                                    Page {currentPageTable} of {Math.ceil(filteredBooks.length / booksPerPage)}
                                </div>
                                <button 
                                    disabled={currentPageTable >= Math.ceil(filteredBooks.length / booksPerPage)}
                                    onClick={() => setCurrentPageTable(prev => Math.min(prev + 1, Math.ceil(filteredBooks.length / booksPerPage)))}
                                    style={{ padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #cbd5e0', borderRadius: '4px', cursor: currentPageTable >= Math.ceil(filteredBooks.length / booksPerPage) ? 'default' : 'pointer', color: '#4a5568', fontWeight: 'bold' }}
                                >Next</button>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Rich Netflix-style Modal */}
            {showIssueModal && selectedBook && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, overflowY: 'auto' }}>
                    <div style={{ backgroundColor: '#181818', width: '100%', maxWidth: '700px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 0 30px rgba(0,0,0,0.8)', position: 'relative' }}>
                        
                        <button onClick={() => setShowIssueModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#141414', border: '1px solid #333', borderRadius: '50%', color: 'white', fontSize: '20px', cursor: 'pointer', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>✖</button>
                        
                        {/* Header Banner */}
                        <div style={{ 
                            height: '350px', backgroundColor: '#1a1a1a', 
                            backgroundImage: `linear-gradient(to top, #181818, transparent), url(${selectedBook.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex', alignItems: 'flex-end', padding: '40px'
                        }}>
                            <div>
                                <h1 style={{ fontSize: '48px', margin: '0 0 10px 0', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{selectedBook.name}</h1>
                                <p style={{ fontSize: '18px', color: '#e5e5e5', margin: 0, fontWeight: '500', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{selectedBook.author}</p>
                            </div>
                        </div>

                        <div style={{ padding: '0 40px 40px' }}>
                            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#d2d2d2', marginBottom: '30px', maxWidth: '80%' }}>
                                This book is currently {modalMode === 'borrow' ? 'available to borrow' : 'in your possession'}. Use the form below to confirm your {modalMode === 'return' ? 'return' : 'checkout'}.
                            </p>

                            <form onSubmit={handleIssueSubmit}>
                                {errorMsg && (
                                    <div style={{ backgroundColor: '#e87c03', padding: '10px 15px', borderRadius: '4px', color: 'white', fontSize: '14px', marginBottom: '20px' }}>{errorMsg}</div>
                                )}
                                
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#a3a3a3', marginBottom: '8px', fontWeight: 'bold' }}>EMPLOYEE ID</label>
                                        <input type="text" value={issueForm.employeeId} 
                                            readOnly 
                                            style={{ width: '100%', padding: '12px', backgroundColor: '#333', border: '1px solid #4d4d4d', borderRadius: '4px', color: '#888', boxSizing: 'border-box', cursor: 'not-allowed' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#a3a3a3', marginBottom: '8px', fontWeight: 'bold' }}>RETURN DATE</label>
                                        <input type="date" value={issueForm.returnDate} 
                                            onChange={e => setIssueForm({ ...issueForm, returnDate: e.target.value })}
                                            style={{ width: '100%', padding: '12px', backgroundColor: '#333', border: '1px solid #4d4d4d', borderRadius: '4px', color: 'white', boxSizing: 'border-box', colorScheme: 'dark' }} />
                                    </div>
                                </div>
                                
                                {modalMode === 'borrow' && (
                                    <p style={{ color: '#a3a3a3', fontSize: '12px', marginTop: '-10px', marginBottom: '20px' }}>
                                        📅 Please confirm for how many days you are picking up this book.
                                    </p>
                                )}
                                
                                <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
                                    <button type="submit"
                                        style={{ padding: '12px 30px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {modalMode === 'return' ? '↩ Confirm Return' : '▶ Confirm Borrow'}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            )}
            {/* Security Modal */}
            {showSecurityModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
                    <div style={{ backgroundColor: '#181818', width: '100%', maxWidth: '400px', borderRadius: '8px', padding: '40px', position: 'relative', border: '1px solid #333' }}>
                        <button onClick={() => setShowSecurityModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#666', fontSize: '24px', cursor: 'pointer' }}>✖</button>
                        <h2 style={{ fontSize: '24px', marginBottom: '25px', color: 'white' }}>Change Password</h2>
                        
                        {securityMsg.text && (
                            <div style={{ padding: '10px', backgroundColor: securityMsg.type === 'error' ? '#e87c03' : '#2f855a', color: 'white', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
                                {securityMsg.text}
                            </div>
                        )}

                        <form onSubmit={handlePasswordUpdate}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '11px', color: '#a3a3a3', marginBottom: '5px', textTransform: 'uppercase' }}>Current Password</label>
                                <input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#333', border: '1px solid #4d4d4d', borderRadius: '4px', color: 'white' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '11px', color: '#a3a3a3', marginBottom: '5px', textTransform: 'uppercase' }}>New Password</label>
                                <input type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#333', border: '1px solid #4d4d4d', borderRadius: '4px', color: 'white' }} />
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '11px', color: '#a3a3a3', marginBottom: '5px', textTransform: 'uppercase' }}>Confirm New Password</label>
                                <input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#333', border: '1px solid #4d4d4d', borderRadius: '4px', color: 'white' }} />
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: 'white', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
                                SAVE CHANGES
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeePortal;
