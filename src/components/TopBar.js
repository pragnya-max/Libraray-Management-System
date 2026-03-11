import React, { useState } from 'react';

const TopBar = ({ setAuth, onToggleSidebar }) => {
    const [showProfile, setShowProfile] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    return (
        <div style={{
            backgroundColor: 'white',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid #e2e8f0',
            margin: '20px 20px 0 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            {/* Blue Hamburger Button */}
            <button 
                onClick={onToggleSidebar}
                style={{
                backgroundColor: '#3B82F6',
                border: 'none',
                borderRadius: '4px',
                width: '35px',
                height: '35px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                gap: '4px'
            }}>
                <div style={{ width: '18px', height: '2px', backgroundColor: 'white' }}></div>
                <div style={{ width: '18px', height: '2px', backgroundColor: 'white' }}></div>
                <div style={{ width: '18px', height: '2px', backgroundColor: 'white' }}></div>
            </button>

            {/* Right side links */}
            <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#4a5568' }}>
                <span onClick={() => setShowProfile(true)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>Profile</span>
                <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => {
                    localStorage.removeItem('token');
                    setAuth(false);
                }}>Logout</span>
                <span onClick={() => setShowHelp(true)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>Help</span>
            </div>

            {/* Profile Modal */}
            {showProfile && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative' }}>
                        <button onClick={() => setShowProfile(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#a0aec0' }}>✖</button>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ fontSize: '60px', marginBottom: '10px' }}>👤</div>
                            <h2 style={{ margin: 0, color: '#2d3748', fontSize: '22px' }}>System Administrator</h2>
                            <p style={{ margin: '5px 0 0', color: '#718096', fontSize: '14px', fontWeight: '600', backgroundColor: '#ebf8ff', display: 'inline-block', padding: '4px 12px', borderRadius: '20px' }}>Super Admin</p>
                        </div>
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#718096', fontSize: '13px', fontWeight: 'bold' }}>EMAIL</span>
                                <span style={{ color: '#4a5568', fontSize: '14px', fontWeight: '500' }}>admin@library.com</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#718096', fontSize: '13px', fontWeight: 'bold' }}>ID NUMBER</span>
                                <span style={{ color: '#4a5568', fontSize: '14px', fontWeight: '500' }}>ADM-001</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#718096', fontSize: '13px', fontWeight: 'bold' }}>JOINED</span>
                                <span style={{ color: '#4a5568', fontSize: '14px', fontWeight: '500' }}>Jan 2024</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Help Modal */}
            {showHelp && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#2d3748', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '24px' }}>ℹ️</span> Help Center
                            </h2>
                            <button onClick={() => setShowHelp(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#a0aec0' }}>✖</button>
                        </div>
                        <div style={{ backgroundColor: '#f7fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#4a5568' }}>Need Assistance?</h4>
                            <p style={{ margin: 0, color: '#718096', fontSize: '14px', lineHeight: '1.5' }}>
                                System documentation is available in your training manual.<br /><br />
                                For immediate technical assistance or issue reporting, please contact IT support at <strong>IT_support@library.com</strong> or call extension <strong>404</strong>.
                            </p>
                        </div>
                        <button onClick={() => setShowHelp(false)} style={{ width: '100%', marginTop: '20px', padding: '10px', backgroundColor: '#4299e1', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopBar;
