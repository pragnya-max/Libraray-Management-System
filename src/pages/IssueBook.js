import React, { useState } from 'react';
import { getStudentDetails, getAvailableAccession, borrowBook } from '../services/api';

const IssueBook = () => {
    const [enrollmentNo, setEnrollmentNo] = useState('');
    const [student, setStudent] = useState(null);
    const [bookName, setBookName] = useState('');
    const [issueDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

    const handleSearchStudent = async () => {
        try {
            const res = await getStudentDetails(enrollmentNo);
            setStudent(res.data);
        } catch (error) {
            alert('Student not found!');
            setStudent(null);
        }
    };

    const handleIssueBook = async () => {
        if (!student) return alert('Please search for a student first.');
        if (!bookName) return alert('Please enter a book name.');

        try {
            // 1. Get an available copy (Accession No) for this book title
            const availRes = await getAvailableAccession(bookName);
            const accessionNo = availRes.data.accession_no;

            // 2. Issue that specific physical copy to the student
            await borrowBook(accessionNo, student.member_id);
            alert(`Book successfully issued! Using Accession: ${accessionNo}`);

            // Reset
            setStudent(null);
            setEnrollmentNo('');
            setBookName('');
        } catch (error) {
            alert(`Issue Failed: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f0f2f5' }}>
            {/* Header Title with requested Book Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backgroundColor: '#fff', borderBottom: '2px solid #ffb74d' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#64b5f6" style={{ marginRight: '10px', transform: 'rotate(-15deg)' }}>
                    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 16H8V4h12v14z" />
                </svg>
                <h2 style={{ color: '#1976d2', margin: 0, fontSize: '28px' }}>Issue Books</h2>
            </div>

            {/* Main Content Panels */}
            <div style={{ display: 'flex', flex: 1 }}>

                {/* Left Panel: Search */}
                <div style={{ flex: '0 0 300px', backgroundColor: '#e0e0e0', padding: '30px', borderRight: '2px solid #ffb74d', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>👨‍🎓</div>
                    <label style={{ fontSize: '16px', marginBottom: '10px' }}>Enter Enrollment NO</label>
                    <input
                        type="text"
                        value={enrollmentNo}
                        onChange={e => setEnrollmentNo(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
                        placeholder="e.g. pu-1002"
                    />
                    <button onClick={handleSearchStudent} style={{ padding: '8px 20px', width: '100%', cursor: 'pointer', fontWeight: 'bold' }}>
                        Search Student
                    </button>

                    <div style={{ marginTop: 'auto', display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                        <button onClick={() => { setStudent(null); setEnrollmentNo(''); }} style={{ padding: '5px 15px', cursor: 'pointer', fontWeight: 'bold' }}>Refresh</button>
                        <button style={{ padding: '5px 15px', cursor: 'pointer', fontWeight: 'bold' }}>Exit</button>
                    </div>
                </div>

                {/* Right Panel: Issue Form */}
                <div style={{ flex: 1, backgroundColor: '#b2ebf2', padding: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '15px', maxWidth: '600px', margin: '0 auto' }}>

                        {/* Fake/Readonly bounds populated by search */}
                        <label>Student Name</label>
                        <input type="text" readOnly value={student?.name || ''} style={{ padding: '8px' }} />

                        <label>Department</label>
                        <input type="text" readOnly value={student ? 'Computer Science' : ''} style={{ padding: '8px' }} />

                        <label>Student Semester</label>
                        <input type="text" readOnly value={student ? '2nd' : ''} style={{ padding: '8px' }} />

                        <label>Student Contact</label>
                        <input type="text" readOnly value={student ? '5566885566' : ''} style={{ padding: '8px' }} />

                        <label>Student Email</label>
                        <input type="text" readOnly value={student ? `${student.name.toLowerCase().replace(' ', '')}@gmail.com` : ''} style={{ padding: '8px' }} />

                        {/* Interactive fields */}
                        <label style={{ fontWeight: 'bold', color: '#006064' }}>Books Name</label>
                        <input
                            type="text"
                            placeholder="Type exact book name..."
                            value={bookName}
                            onChange={e => setBookName(e.target.value)}
                            style={{ padding: '8px' }}
                        />

                        <label style={{ fontWeight: 'bold', color: '#006064' }}>Book Issue Date</label>
                        <input type="date" value={issueDate} readOnly style={{ padding: '8px' }} />

                    </div>

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button onClick={handleIssueBook} style={{ padding: '10px 30px', backgroundColor: '#e0f7fa', border: '1px solid #00838f', color: '#00838f', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                            Issue Book
                        </button>
                        <p style={{ color: 'red', fontWeight: 'bold', marginTop: '15px' }}>
                            Maximum 3 Books Can be ISSUED to 1 Student
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default IssueBook;
