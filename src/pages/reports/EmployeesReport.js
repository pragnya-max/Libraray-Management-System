import React from 'react';

const EmployeesReport = ({ employees = [] }) => {

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ backgroundColor: '#f7fafc', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button 
                    onClick={handlePrint}
                    style={{ 
                        padding: '5px 15px', 
                        backgroundColor: '#e2e8f0', 
                        border: '1px solid #cbd5e0', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#4a5568'
                    }}
                >
                    Print
                </button>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '0', fontSize: '24px', letterSpacing: '1px', fontWeight: 'normal' }}>
                    EMPLOYEES REPORT
                </h2>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: 'white', color: '#4a5568', borderBottom: '2px solid #2d3748', fontSize: '13px' }}>EMPLOYEE NAME</th>
                            <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: 'white', color: '#4a5568', borderBottom: '2px solid #2d3748', fontSize: '13px' }}>ID CARD NUMBER</th>
                            <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: 'white', color: '#4a5568', borderBottom: '2px solid #2d3748', fontSize: '13px' }}>CONTACT</th>
                            <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: 'white', color: '#4a5568', borderBottom: '2px solid #2d3748', fontSize: '13px' }}>EMAIL ADDRESS</th>
                            <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: 'white', color: '#4a5568', borderBottom: '2px solid #2d3748', fontSize: '13px' }}>POSITION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((e, idx) => (
                            <tr key={e.id} style={{ backgroundColor: idx % 2 === 0 ? '#e2e8f0' : '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '12px 10px', color: '#4a5568', fontSize: '14px' }}>{e.name}</td>
                                <td style={{ padding: '12px 10px', color: '#718096', fontSize: '14px' }}>{e.idCardNo}</td>
                                <td style={{ padding: '12px 10px', color: '#718096', fontSize: '14px' }}>{e.contact}</td>
                                <td style={{ padding: '12px 10px', color: '#718096', fontSize: '14px' }}>{e.email}</td>
                                <td style={{ padding: '12px 10px', color: '#718096', fontSize: '14px' }}>{e.position}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeesReport;
