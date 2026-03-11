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

    const holidays = [
        { name: "Makar Sankranti", date: 14, month: 0, type: "G" },
        { name: "Subash Chandra Bose Jayanti / Vir Surendra Sai Jayanti / Basanta Panchami", date: 23, month: 0, type: "G" },
        { name: "Republic Day", date: 26, month: 0, type: "G" },
        { name: "Dola Purnima", date: 3, month: 2, type: "G" },
        { name: "Holi", date: 4, month: 2, type: "G" },
        { name: "Id-Ul-Fitre", date: 21, month: 2, type: "G" },
        { name: "Shree Ram Nabami", date: 27, month: 2, type: "G" },
        { name: "Utkal Divas", date: 1, month: 3, type: "G" },
        { name: "Good Friday", date: 3, month: 3, type: "G" },
        { name: "Mahashubha Sankranti / Dr. B.R. Ambedkar Jayanti", date: 14, month: 3, type: "G" },
        { name: "Buddha Purnima / Birthday of Pandit Raghunath Murmu", date: 1, month: 4, type: "G" },
        { name: "Sabitri Amabasya", date: 14, month: 4, type: "G" },
        { name: "Id-ul-Zuha", date: 27, month: 4, type: "G" },
        { name: "Raja Sankranti", date: 15, month: 5, type: "G" },
        { name: "Muharram", date: 26, month: 5, type: "G" },
        { name: "Rath Yatra", date: 16, month: 6, type: "G" },
        { name: "Independence Day", date: 15, month: 7, type: "G" },
        { name: "Birthday of Prophet Mohammad", date: 26, month: 7, type: "G" },
        { name: "Jhulana Purnima", date: 27, month: 7, type: "G" },
        { name: "Janmastami", date: 4, month: 8, type: "G" },
        { name: "Ganesh Puja", date: 14, month: 8, type: "G" },
        { name: "Nuakhai", date: 15, month: 8, type: "G" },
        { name: "Day following Nuakhai", date: 16, month: 8, type: "G" },
        { name: "Gandhi Jayanti", date: 2, month: 9, type: "G" },
        { name: "Maha Saptami", date: 17, month: 9, type: "G" },
        { name: "Maha Nabami", date: 19, month: 9, type: "G" },
        { name: "Vijaya Dasami", date: 20, month: 9, type: "G" },
        { name: "Rasa Purnima", date: 24, month: 10, type: "G" },
        { name: "X-Mas Day", date: 25, month: 11, type: "G" }
    ];

    const [monthOffset, setMonthOffset] = useState(0);

    const today = new Date();
    const viewedDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    
    const currentMonthIndex = viewedDate.getMonth(); // 0 is January, 11 is December
    const currentMonth = viewedDate.toLocaleString('default', { month: 'long' });
    const currentYear = viewedDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const blanksAtEnd = (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7;

    const holidaysThisMonth = holidays.filter(h => h.month === currentMonthIndex);

    const getHolidayTypeColor = (type) => {
        if (type === 'G') return '#e51a24'; // Red for General
        if (type === 'R') return '#0f8a3d'; // Green for Restricted
        return '#e51a24'; // Default to red
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
                    title="Borrow books" 
                    value={borrowBooks} 
                    iconFill="#3B82F6"
                    iconBg="#EFF6FF"
                >
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line>
                </KPI>
                <KPI 
                    title="Return books" 
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
                <div style={{ flex: '3', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Calendar Title (Plain Text instead of dark header match) */}
                    <div style={{ textAlign: 'center', fontSize: '24px', color: '#111827', marginBottom: '-10px' }}>
                        Calender
                    </div>

                    {/* Calendar View */}
                    <div style={{ backgroundColor: '#ffffff', padding: '0', borderRadius: '0', boxShadow: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#c6f6d5', padding: '10px', color: '#111827', gap: '15px' }}>
                            <button 
                                onClick={() => setMonthOffset(monthOffset - 1)}
                                style={{ cursor: 'pointer', background: 'transparent', border: 'none', color: '#111827', fontSize: '14px', display: 'flex', alignItems: 'center', padding: '5px' }}>
                                ◀
                            </button>
                            
                            <h2 style={{ fontSize: '14px', margin: 0, fontWeight: 'bold', minWidth: '120px', textAlign: 'center', color: '#111827' }}>
                               {currentMonth} {currentYear}
                            </h2>

                            <button 
                                onClick={() => setMonthOffset(monthOffset + 1)}
                                style={{ cursor: 'pointer', background: 'transparent', border: 'none', color: '#111827', fontSize: '14px', display: 'flex', alignItems: 'center', padding: '5px' }}>
                                ▶
                            </button>
                        </div>

                        {/* Dynamic Calendar Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e2e8f0', border: '1px solid #e2e8f0' }}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} style={{ padding: '10px', backgroundColor: '#ffffff', textAlign: 'center', fontWeight: 'bold', fontSize: '12px', color: '#6B7280' }}>{d}</div>
                        ))}
                        {/* Blank days for start of month */}
                        {[...Array(firstDayOfMonth)].map((_, i) => (
                            <div key={`start-${i}`} style={{ backgroundColor: '#ffffff' }}></div>
                        ))}
                        {/* Calendar Days */}
                        {[...Array(daysInMonth)].map((_, i) => {
                            // Check if today is a holiday
                            const dayNum = i + 1;
                            const holidayObj = holidaysThisMonth.find(h => h.date === dayNum);
                            const isHoliday = !!holidayObj;
                            const isTodayDate = dayNum === today.getDate() && currentMonthIndex === today.getMonth() && currentYear === today.getFullYear();
                            
                            return (
                                <div key={`day-${i}`} style={{ 
                                    padding: '10px 5px', 
                                    backgroundColor: isHoliday ? '#fbe9e9' : '#ffffff', 
                                    textAlign: 'center', fontSize: '12px', color: '#9CA3AF', position: 'relative', minHeight: '30px',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <span style={{ 
                                        color: isTodayDate ? '#3B82F6' : (isHoliday ? '#EF4444' : '#9CA3AF'), 
                                        fontWeight: (isTodayDate || isHoliday) ? 'bold' : 'normal',
                                        border: isTodayDate ? '2px solid #3B82F6' : 'none',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>{dayNum}</span>
                                </div>
                            );
                        })}
                        {/* Blanks for end of calendar */}
                        {[...Array(blanksAtEnd)].map((_, i) => (
                            <div key={`end-${i}`} style={{ backgroundColor: '#ffffff' }}></div>
                        ))}
                        </div>
                    </div>

                    {/* Upcoming Holidays List */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '0', boxShadow: 'none', overflow: 'hidden' }}>
                        <div style={{ backgroundColor: '#c6f6d5', padding: '15px', borderBottom: 'none' }}>
                            <h2 style={{ fontSize: '16px', margin: 0, color: '#111827', fontWeight: 'bold' }}>
                                Holidays <span style={{ fontWeight: 'normal', color: '#111827' }}>of the Month</span>
                            </h2>
                        </div>
                    
                        <ul style={{ listStyleType: 'none', padding: '15px 0', margin: '0' }}>
                            {holidaysThisMonth.length > 0 ? holidaysThisMonth.map((holiday, index) => {
                                return (
                                    <li key={index} style={{ 
                                        padding: '10px 15px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '15px', 
                                        marginBottom: '2px',
                                        backgroundColor: 'transparent',
                                        borderRadius: '0'
                                    }}>
                                        <div style={{ 
                                            backgroundColor: getHolidayTypeColor(holiday.type), 
                                            color: 'white', 
                                            width: '28px', 
                                            height: '28px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            fontWeight: 'bold', 
                                            fontSize: '12px',
                                            borderRadius: '50%',
                                            flexShrink: 0
                                        }}>
                                            {holiday.date}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '13px', color: '#111827', fontWeight: '600' }}>
                                                {holiday.name}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#3B82F6', marginTop: '2px' }}>
                                                {holiday.type === 'G' ? 'Public Holiday' : 'Restricted Holiday'}
                                            </div>
                                        </div>
                                    </li>
                                );
                            }) : (
                                <li style={{ padding: '20px', textAlign: 'center', color: '#a0aec0' }}>
                                    No holidays this month.
                                </li>
                            )}
                        </ul>
                    </div>
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
