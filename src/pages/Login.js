import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth, employees }) => {
    const [view, setView] = useState('landing'); // 'landing' | 'admin' | 'employee'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        if (view === 'admin') {
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('token', 'admin_token');
                localStorage.setItem('userRole', 'admin');
                setAuth(true, 'admin');
                navigate('/dashboard');
                return;
            }
        } else if (view === 'employee') {
            // Verify against actual employee data
            const employee = employees.find(e => e.idCardNo === username);
            if (employee && employee.password === password) {
                localStorage.setItem('token', 'employee_token');
                localStorage.setItem('userRole', 'employee');
                localStorage.setItem('employeeId', username);
                setAuth(true, 'employee');
                navigate('/employee-portal');
                return;
            } else if (!employee) {
                setError('ID Card No not found. Please contact admin.');
                return;
            } else {
                setError('Incorrect password. Please try again.');
                return;
            }
        }

        setError('Sorry, we can\'t find an account with this ID or password. Please try again.');
    };

    const containerStyle = {
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#000',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.95) 100%), url('/background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
    };

    return (
        <div style={containerStyle}>
            {/* Header / Logo Area */}
            <div style={{ padding: '24px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="40" height="40" viewBox="0 0 100 100">
                        <polygon points="50,0 100,100 0,100" fill="#48bb78" />
                        <polygon points="25,50 75,50 50,100" fill="#c6f6d5" />
                        <polygon points="50,0 75,50 25,50" fill="#48bb78" />
                    </svg>
                    <span style={{ color: '#48bb78', fontSize: '28px', fontWeight: '800', letterSpacing: '1px' }}>LIBRARY</span>
                </div>
                
                {view !== 'landing' && (
                    <button 
                        onClick={() => { setView('landing'); setError(''); setUsername(''); setPassword(''); }}
                        style={{
                            padding: '8px 18px',
                            backgroundColor: '#333',
                            color: 'white',
                            border: '1px solid #737373',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Back
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 5% 100px',
                flexDirection: 'column',
                textAlign: 'center',
                zIndex: 1
            }}>
                {view === 'landing' ? (
                    <div style={{ maxWidth: '800px' }}>
                        <h1 style={{ color: 'white', fontSize: '56px', fontWeight: '900', margin: '0 0 16px 0', lineHeight: '1.2' }}>
                            Unlimited books, journals, and resources
                        </h1>
                        <p style={{ color: 'white', fontSize: '24px', margin: '0 0 48px 0' }}>
                            Read anywhere. Return anytime.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <button 
                                onClick={() => setView('admin')}
                                style={{
                                    padding: '20px 40px',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    backgroundColor: '#38a169',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                Admin Portal
                            </button>
                            <button 
                                onClick={() => setView('employee')}
                                style={{
                                    padding: '20px 40px',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    backgroundColor: '#2b6cb0',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                Employee Portal
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        padding: '60px 68px 40px',
                        borderRadius: '4px',
                        width: '100%',
                        maxWidth: '450px',
                        boxSizing: 'border-box',
                        zIndex: 2
                    }}>
                        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0', textAlign: 'left' }}>
                            {view === 'admin' ? 'Admin Login' : 'Employee Login'}
                        </h1>
                        <p style={{ color: '#a3a3a3', fontSize: '16px', margin: '0 0 28px 0', textAlign: 'left' }}>
                            Please enter your credentials to access the {view} portal.
                        </p>

                        {error && (
                            <div style={{ backgroundColor: '#e87c03', padding: '10px 20px', borderRadius: '4px', color: 'white', fontSize: '14px', marginBottom: '16px', textAlign: 'left' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder={view === 'admin' ? "Username" : "Employee ID"}
                                    style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        backgroundColor: '#333333',
                                        border: '1px solid #737373',
                                        borderRadius: '4px',
                                        color: 'white',
                                        fontSize: '16px',
                                        boxSizing: 'border-box',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder={view === 'admin' ? "Password" : "PIN (Try 1234)"}
                                    style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        backgroundColor: '#333333',
                                        border: '1px solid #737373',
                                        borderRadius: '4px',
                                        color: 'white',
                                        fontSize: '16px',
                                        boxSizing: 'border-box',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <button type="submit" style={{
                                marginTop: '24px',
                                padding: '16px',
                                backgroundColor: view === 'admin' ? '#38a169' : '#2b6cb0',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                boxSizing: 'border-box',
                                width: '100%'
                            }}>
                                Sign In
                            </button>
                        </form>
                    </div>
                )}
            </div>
            
            {/* Footer bar */}
            <div style={{ padding: '30px 5%', zIndex: 10 }}>
                <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>Questions? Call 000-800-040-XXXX</p>
                <p style={{ color: '#555', fontSize: '12px', marginTop: '10px' }}>
                    {view === 'landing' ? 'Choose your portal to continue.' : `Testing: Admin (admin/admin123), Employee (Any ID / 1234)`}
                </p>
            </div>
        </div>
    );
};
            
export default Login;
