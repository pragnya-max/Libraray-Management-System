import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth }) => {
    const [mode, setMode] = useState(null); // null | 'admin' | 'employee'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('token', 'admin_token');
            localStorage.setItem('userRole', 'admin');
            setAuth(true, 'admin');
            navigate('/dashboard');
        } else {
            setError('Invalid admin credentials. Use admin / admin123');
        }
    };

    const handleEmployeeLogin = (e) => {
        e.preventDefault();
        // Any employee ID card + pin 1234 works
        if (username && password === '1234') {
            localStorage.setItem('token', 'employee_token');
            localStorage.setItem('userRole', 'employee');
            localStorage.setItem('employeeId', username);
            setAuth(true, 'employee');
            navigate('/employee-portal');
        } else {
            setError('Use your Employee ID Card Number and PIN: 1234');
        }
    };

    const cardStyle = (active) => ({
        flex: 1,
        padding: '40px 30px',
        borderRadius: '12px',
        cursor: 'pointer',
        border: active ? '3px solid #4299e1' : '3px solid transparent',
        backgroundColor: active ? '#fffbf2' : 'white',
        boxShadow: active ? '0 8px 24px rgba(66,153,225,0.25)' : '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    });

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: '100vh', backgroundColor: '#f0f4f8',
            fontFamily: "'Segoe UI', sans-serif"
        }}>
            <div style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>

                {/* Logo + Title */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <svg width="70" height="70" viewBox="0 0 100 100" style={{ marginBottom: '10px' }}>
                        <polygon points="50,0 100,100 0,100" fill="#8bc34a" />
                        <polygon points="25,50 75,50 50,100" fill="#c8e6c9" />
                        <polygon points="50,0 75,50 25,50" fill="#8bc34a" />
                    </svg>
                    <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#2d3748' }}>Library Management System</h1>
                    <p style={{ color: '#718096', marginTop: '6px' }}>Select your login portal to continue</p>
                </div>

                {/* Portal Selection Cards */}
                {!mode && (
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={cardStyle(false)} onClick={() => setMode('admin')}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
                            <h2 style={{ margin: '0 0 8px', color: '#2d3748', fontSize: '20px' }}>Admin Portal</h2>
                            <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
                                Full access: manage books, employees, borrow records and reports
                            </p>
                            <button style={{
                                marginTop: '24px', padding: '12px 30px', backgroundColor: '#4299e1',
                                color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700',
                                fontSize: '14px', cursor: 'pointer', width: '100%'
                            }}>
                                Admin Login →
                            </button>
                        </div>

                        <div style={cardStyle(false)} onClick={() => setMode('employee')}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
                            <h2 style={{ margin: '0 0 8px', color: '#2d3748', fontSize: '20px' }}>Employee Portal</h2>
                            <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
                                View book availability, search books, and track your borrowed books
                            </p>
                            <button style={{
                                marginTop: '24px', padding: '12px 30px', backgroundColor: '#48bb78',
                                color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700',
                                fontSize: '14px', cursor: 'pointer', width: '100%'
                            }}>
                                Employee Login →
                            </button>
                        </div>
                    </div>
                )}

                {/* Admin Login Form */}
                {mode === 'admin' && (
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', padding: '40px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxWidth: '420px', margin: '0 auto'
                    }}>
                        <button onClick={() => { setMode(null); setError(''); }} style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}>
                            ← Back
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <span style={{ fontSize: '32px' }}>🔐</span>
                            <div>
                                <h2 style={{ margin: 0, color: '#2d3748' }}>Admin Login</h2>
                                <p style={{ margin: 0, color: '#718096', fontSize: '13px' }}>Full system access</p>
                            </div>
                        </div>

                        <form onSubmit={handleAdminLogin}>
                            {error && <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fc8181', color: '#c53030', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '6px', fontWeight: '600' }}>USERNAME</label>
                                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin"
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '6px', fontWeight: '600' }}>PASSWORD</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <button type="submit" style={{
                                width: '100%', padding: '14px', backgroundColor: '#4299e1',
                                color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700',
                                fontSize: '15px', cursor: 'pointer'
                            }}>Login as Admin</button>
                            <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '12px', marginTop: '16px' }}>Hint: admin / admin123</p>
                        </form>
                    </div>
                )}

                {/* Employee Login Form */}
                {mode === 'employee' && (
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', padding: '40px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxWidth: '420px', margin: '0 auto'
                    }}>
                        <button onClick={() => { setMode(null); setError(''); }} style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}>
                            ← Back
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <span style={{ fontSize: '32px' }}>👤</span>
                            <div>
                                <h2 style={{ margin: 0, color: '#2d3748' }}>Employee Login</h2>
                                <p style={{ margin: 0, color: '#718096', fontSize: '13px' }}>Book catalogue access</p>
                            </div>
                        </div>

                        <form onSubmit={handleEmployeeLogin}>
                            {error && <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fc8181', color: '#c53030', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '6px', fontWeight: '600' }}>EMPLOYEE ID CARD NUMBER</label>
                                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. EMP001"
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '6px', fontWeight: '600' }}>PIN</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••"
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <button type="submit" style={{
                                width: '100%', padding: '14px', backgroundColor: '#48bb78',
                                color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700',
                                fontSize: '15px', cursor: 'pointer'
                            }}>Login as Employee</button>
                            <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '12px', marginTop: '16px' }}>Use your ID Card No. (e.g. EMP001) and PIN: 1234</p>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Login;
