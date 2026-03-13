import React, { useState } from 'react';

const Dashboard = () => {
    const KPI = ({ title, value, iconFill, iconBg, children }) => (
        <div style={{
            padding: '20px 25px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <div style={{ 
                    backgroundColor: iconBg, 
                    borderRadius: '8px', 
                    width: '45px', 
                    height: '45px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconFill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {children}
                    </svg>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
                    {value}
                </div>
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600', marginLeft: '2px' }}>
                {title}
            </div>
        </div>
    );

    // Fetch data from localStorage
    const booksData = JSON.parse(localStorage.getItem('lms_books')) || [];
    const membersData = JSON.parse(localStorage.getItem('lms_employees')) || [];

    // Calculate metrics
    const totalBooks = booksData.length;
    const borrowBooks = booksData.filter(b => b.status === 'Borrowed').length;
    const returnBooks = booksData.filter(b => b.status === 'Available' || b.status === 'Returned').length;
    const overdueBooks = booksData.filter(b => b.status === 'Overdue').length; // Or calculated based on due date
    const totalMembers = membersData.length;

    // Build recent checkouts from database
    const recentCheckouts = booksData
        .filter(b => b.status === 'Borrowed' && b.borrowedBy)
        // Sort by id descending as a mock for "recent"
        .sort((a, b) => b.id - a.id)
        .map(b => {
             // Try to lookup member to get proper ID, else default to string
             const memberRecord = membersData.find(m => m.name === b.borrowedBy);
             return {
                id: memberRecord ? memberRecord.idCardNo : (b.borrowedById || '-'),
                title: b.name,
                member: b.borrowedBy,
                // Format dates simply like DD/MM/YYYY
                issued: b.dateIssued ? new Date(b.dateIssued).toLocaleDateString('en-GB') : '-',
                returned: b.returnDate ? new Date(b.returnDate).toLocaleDateString('en-GB') : '-'
             };
        });

    // Pagination logic for Recent Checkouts
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCheckouts = recentCheckouts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(recentCheckouts.length / itemsPerPage);

    const handlePrevPage = (e) => {
        e.preventDefault();
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = (e) => {
        e.preventDefault();
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const BookStatusChart = ({ available, borrowed, overdue }) => {
        const total = available + borrowed + overdue || 1;
        const issuedPercent = Math.round((borrowed / total) * 100);
        
        // Simple SVG Donut Chart logic
        const radius = 70;
        const strokeWidth = 35;
        const normalizedRadius = radius - strokeWidth / 2;
        const circumference = normalizedRadius * 2 * Math.PI;
        
        

        return (
            <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '18px', margin: 0, color: '#111827', fontWeight: 'bold' }}>Books Circulation</h2>
                    <div style={{ color: '#9CA3AF', cursor: 'pointer' }}>⋮</div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00BFFF' }}></div>
                        <span style={{ color: '#6B7280' }}>Issued Books</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFD700' }}></div>
                        <span style={{ color: '#6B7280' }}>Reserved Books</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF4500' }}></div>
                        <span style={{ color: '#6B7280' }}>Overdue Books</span>
                    </div>
                </div>

                {/* Donut Chart SVG */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
                        {/* Issued (Blue) */}
                        <circle
                            stroke="#00BFFF"
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference + ' ' + circumference}
                            style={{ strokeDashoffset: circumference - (borrowed / total) * circumference }}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                        {/* Reserved/Available (Yellow) */}
                        <circle
                            stroke="#FFD700"
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference + ' ' + circumference}
                            style={{ 
                                strokeDashoffset: circumference - (available / total) * circumference,
                                transform: `rotate(${(borrowed/total) * 360}deg)`,
                                transformOrigin: 'center'
                            }}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                        {/* Overdue (Red) */}
                        <circle
                            stroke="#FF4500"
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference + ' ' + circumference}
                            style={{ 
                                strokeDashoffset: circumference - (overdue / total) * circumference,
                                transform: `rotate(${((borrowed + available)/total) * 360}deg)`,
                                transformOrigin: 'center'
                            }}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                    </svg>
                    
                    {/* Center Text */}
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1F2937' }}>{issuedPercent}%</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Circulation</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100%', padding: '0' }}>
            <h1 style={{ color: '#3B82F6', fontSize: '16px', marginBottom: '20px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>ADMINISTRATOR DASHBOARD</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '30px' }}>
                <KPI 
                    title="Total Books" 
                    value={totalBooks}
                    iconFill="#3B82F6"
                    iconBg="#EFF6FF"
                >
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line>
                </KPI>
                <KPI 
                    title="Total Members" 
                    value={totalMembers} 
                    iconFill="#10B981"
                    iconBg="#ECFDF5"
                >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </KPI>
                <KPI 
                    title="Borrowed books" 
                    value={borrowBooks} 
                    iconFill="#3B82F6"
                    iconBg="#EFF6FF"
                >
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line>
                </KPI>
                <KPI 
                    title="Available Books" 
                    value={returnBooks} 
                    iconFill="#F59E0B"
                    iconBg="#FFFBEB"
                >
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line>
                </KPI>
                <KPI 
                    title="Overdue books" 
                    value={overdueBooks} 
                    iconFill="#EF4444"
                    iconBg="#FEF2F2"
                >
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line>
                </KPI>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: '3' }}>
                    <BookStatusChart 
                        available={returnBooks}
                        borrowed={borrowBooks}
                        overdue={overdueBooks}
                    />
                </div>

                <div style={{ flex: '7' }}>
                    {/* Recent Checkouts Table */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', margin: 0, color: '#111827', fontWeight: 'bold' }}>Recent Checkout's</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={handlePrevPage} 
                                        disabled={currentPage === 1}
                                        style={{ 
                                            background: 'none', border: 'none', cursor: currentPage === 1 ? 'default' : 'pointer', 
                                            color: currentPage === 1 ? '#D1D5DB' : '#111827', fontSize: '16px' 
                                        }}>
                                        ◀
                                    </button>
                                    <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center' }}>
                                        {currentPage} / {totalPages || 1}
                                    </span>
                                    <button 
                                        onClick={handleNextPage} 
                                        disabled={currentPage >= totalPages}
                                        style={{ 
                                            background: 'none', border: 'none', cursor: currentPage >= totalPages ? 'default' : 'pointer', 
                                            color: currentPage >= totalPages ? '#D1D5DB' : '#111827', fontSize: '16px' 
                                        }}>
                                        ▶
                                    </button>
                                </div>
                                <a href="/dashboard" onClick={(e) => e.preventDefault()} style={{ color: '#3B82F6', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>View All</a>
                            </div>
                        </div>
                        
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ color: '#111827', borderBottom: '1px solid #F3F4F6' }}>
                                    <th style={{ padding: '12px 0', fontWeight: 'normal', color: '#6B7280', textTransform: 'uppercase', fontSize: '11px' }}>EMP ID</th>
                                    <th style={{ padding: '12px 0', fontWeight: 'normal', color: '#6B7280', textTransform: 'uppercase', fontSize: '11px' }}>BOOK</th>
                                    <th style={{ padding: '12px 0', fontWeight: 'normal', color: '#6B7280', textTransform: 'uppercase', fontSize: '11px' }}>Member</th>
                                    <th style={{ padding: '12px 0', fontWeight: 'normal', color: '#6B7280', textTransform: 'uppercase', fontSize: '11px' }}>Issued Date</th>
                                    <th style={{ padding: '12px 0', fontWeight: 'normal', color: '#6B7280', textTransform: 'uppercase', fontSize: '11px' }}>Return Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCheckouts.length > 0 ? currentCheckouts.map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: idx === currentCheckouts.length - 1 ? 'none' : '1px solid #F3F4F6', color: '#111827' }}>
                                        <td style={{ padding: '15px 0' }}>{row.id}</td>
                                        <td style={{ padding: '15px 0' }}>{row.title}</td>
                                        <td style={{ padding: '15px 0' }}>{row.member}</td>
                                        <td style={{ padding: '15px 0' }}>{row.issued}</td>
                                        <td style={{ padding: '15px 0' }}>{row.returned}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF' }}>No recent checkouts found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
