import React, { useState } from 'react';

const DataImport = ({ books, setBooks, employees, setEmployees }) => {
    const [status, setStatus] = useState('');
    const [previewData, setPreviewData] = useState(null);
    const [importType, setImportType] = useState(null);

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            processCSV(text, type);
        };
        reader.readAsText(file);
    };

    const processCSV = (csvText, type) => {
        const splitCSVRow = (row) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            for (let i = 0; i < row.length; i++) {
                const char = row[i];
                if (char === '"') inQuotes = !inQuotes;
                else if (char === ',' && !inQuotes) {
                    result.push(current.trim().replace(/^"|"$/g, ''));
                    current = '';
                } else current += char;
            }
            result.push(current.trim().replace(/^"|"$/g, ''));
            return result;
        };

        const allLines = csvText.split(/\r?\n/).filter(line => line.trim());
        if (allLines.length < 1) return;

        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Smarter Header Detection: Find the first row that looks like a header
        let headerRowIndex = 0;
        const bookKeywords = ['name', 'book', 'title', 'heading', 'author', 'acc', 'isbn', 'publisher'];
        const empKeywords = ['name', 'id', 'employee', 'contact', 'email', 'position'];
        const keywords = type === 'books' ? bookKeywords : empKeywords;

        for (let i = 0; i < Math.min(allLines.length, 10); i++) {
            const row = splitCSVRow(allLines[i]);
            if (row.some(cell => keywords.some(kw => normalize(cell).includes(kw)))) {
                headerRowIndex = i;
                break;
            }
        }

        const rawHeaders = splitCSVRow(allLines[headerRowIndex]);
        const headerMap = {};
        rawHeaders.forEach((h, i) => { headerMap[normalize(h)] = i; });

        const getVal = (row, ...keys) => {
            for (const key of keys) {
                const idx = headerMap[normalize(key)];
                if (idx !== undefined) return row[idx] || '';
            }
            return '';
        };

        const data = [];
        for (let i = headerRowIndex + 1; i < allLines.length; i++) {
            const values = splitCSVRow(allLines[i]);
            if (values.length < 2) continue;

            if (type === 'books') {
                data.push({
                    id: Date.now() + i,
                    name: getVal(values, 'nameofbook', 'bookname', 'name', 'title', 'book', 'books', 'heading', 'itemname', 'particulars'),
                    author: getVal(values, 'author', 'authorname', 'writer', 'authors'),
                    subject: getVal(values, 'subject', 'category', 'genre', 'dept', 'department'),
                    status: getVal(values, 'status', 'availability') || 'Available',
                    isbn: getVal(values, 'isbn'),
                    edition: getVal(values, 'edition'),
                    image: getVal(values, 'image', 'picture', 'cover', 'coverpage'),
                    borrowedBy: ''
                });
            } else {
                data.push({
                    id: Date.now() + i,
                    name: getVal(values, 'name', 'employeename', 'full name', 'membername', 'studentname', 'teachername'),
                    idCardNo: getVal(values, 'idcardno', 'id', 'employeeid', 'code', 'memberid', 'rollno', 'cardno', 'id_number', 'employee_id', 'id_code', 'card_no', 'emp_id', 'idcardnumber', 'id_card_no', 'emp_no', 'employee_no', 'idno', 'empno', 'memberno', 'staffid', 'staffno'),
                    contact: getVal(values, 'contact', 'phone', 'mobile', 'tel', 'whatsapp'),
                    email: getVal(values, 'email', 'mail', 'emailaddress'),
                    position: getVal(values, 'position', 'role', 'designation', 'class', 'grade'),
                    status: getVal(values, 'status', 'state') || 'Active'
                });
            }
        }

        setPreviewData(data);
        setImportType(type);
        setStatus(`Detected ${data.length} records. Please check the preview below.`);
    };

    const confirmImport = () => {
        if (importType === 'books') {
            // Simple merge: keep existing, add new if not present (by name/author)
            const mergedBooks = [...books];
            previewData.forEach(newItem => {
                if (!books.some(b => b.name === newItem.name && b.author === newItem.author)) {
                    mergedBooks.push(newItem);
                }
            });
            setBooks(mergedBooks);
        } else {
            // Merge employees by idCardNo
            const mergedEmployees = [...employees];
            previewData.forEach(newEmp => {
                const existingIdx = mergedEmployees.findIndex(e => e.idCardNo === newEmp.idCardNo);
                if (existingIdx > -1) {
                    mergedEmployees[existingIdx] = { ...mergedEmployees[existingIdx], ...newEmp };
                } else {
                    mergedEmployees.push({ ...newEmp, password: '1234' }); // Default password for new
                }
            });
            setEmployees(mergedEmployees);
        }
        setStatus(`Successfully imported/merged ${previewData.length} records!`);
        setPreviewData(null);
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ color: '#2d3748', marginBottom: '20px' }}>Bulk Data Import</h1>
            
            {status && (
                <div style={{ padding: '15px', backgroundColor: '#ebf8ff', color: '#2b6cb0', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', border: '1px solid #bee3f8' }}>
                    {status}
                </div>
            )}

            {!previewData ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f7fafc' }}>
                        <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#2d3748' }}>Import Books</h2>
                        <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, 'books')} style={{ display: 'block', marginBottom: '10px' }} />
                        <p style={{ fontSize: '11px', color: '#718096' }}>Supports: Book Name, Author, Subject, etc.</p>
                    </div>

                    <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f7fafc' }}>
                        <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#2d3748' }}>Import Employees</h2>
                        <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, 'employees')} style={{ display: 'block', marginBottom: '10px' }} />
                        <p style={{ fontSize: '11px', color: '#718096' }}>Supports: Name, ID, Contact, Position, etc.</p>
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#2d3748' }}>Data Mapping Preview</h2>
                    <div style={{ backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '12px', color: '#c53030' }}>
                        💡 Verify if <strong>{importType === 'books' ? 'Book Name' : 'Name'}</strong> column shows correct data.
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px', marginBottom: '20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f7fafc' }}>
                                <tr>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>#</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>{importType === 'books' ? 'BOOK NAME' : 'NAME'}</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>{importType === 'books' ? 'AUTHOR' : 'ID'}</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.slice(0, 5).map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '10px' }}>{idx + 1}</td>
                                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.name || <span style={{color:'red'}}>MISSING</span>}</td>
                                        <td style={{ padding: '10px' }}>{importType === 'books' ? row.author : row.idCardNo}</td>
                                        <td style={{ padding: '10px' }}>{row.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={confirmImport} style={{ backgroundColor: '#48bb78', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
                            YES, IMPORT {previewData.length} RECORDS
                        </button>
                        <button onClick={() => setPreviewData(null)} style={{ backgroundColor: '#a0aec0', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
                            CANCEL
                        </button>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#ebf8ff', borderRadius: '8px', color: '#2b6cb0', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <strong>Tip:</strong> You can export your Excel sheet as a CSV file to use this tool, or click reset to load from original files.
                </div>
                <button 
                    onClick={() => {
                        if(window.confirm("Warning: This will clear all changes and reload data from original CSV files. Are you sure?")) {
                            localStorage.removeItem('lms_books');
                            localStorage.removeItem('lms_employees');
                            window.location.reload();
                        }
                    }}
                    style={{ backgroundColor: '#f56565', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    RESET TO ORIGINALS
                </button>
            </div>
        </div>
    );
};

export default DataImport;
