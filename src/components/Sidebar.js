import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import avatarLogo from '../Aveti Logo.png'; // Assuming it's in src/

const Sidebar = ({ collapsed }) => {
    const location = useLocation();
    const [reportsOpen, setReportsOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg> },
        { name: 'Employees', path: '/members', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> }, 
        { name: 'Books', path: '/books', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> },
    ];

    const reportRoutes = [
        { name: 'Employee Report', path: '/reports/employees' },
        { name: 'Books Report', path: '/reports/available-books' },
        { name: 'Issued Books Report', path: '/reports/issued-books' },
    ];

    return (
        <div style={{
            width: collapsed ? '0px' : '250px',
            minWidth: collapsed ? '0px' : '250px',
            backgroundColor: '#ffffff',
            borderRight: collapsed ? 'none' : '1px solid #e2e8f0',
            color: '#718096',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'width 0.3s ease, min-width 0.3s ease'
        }}>
            <div style={{ padding: '30px', textAlign: 'center', borderBottom: '1px solid #edf2f7' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#f7fafc',
                    borderRadius: '50%',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    <img src={avatarLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
            </div>

            {/* Navigation */}
            <ul style={{ listStyle: 'none', padding: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {menuItems.map(item => {
                    const isActive = location.pathname === item.path;
                    return (
                        <li key={item.name} style={{
                            backgroundColor: isActive ? '#74c878' : 'transparent',
                            borderRadius: '6px',
                        }}>
                            <Link to={item.path} style={{
                                color: isActive ? '#ffffff' : '#718096',
                                textDecoration: 'none',
                                padding: '12px 15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                fontWeight: '500',
                                fontSize: '15px',
                            }}>
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    )
                })}
                
                {/* Generate Reports Dropdown */}
                <li style={{
                    backgroundColor: location.pathname.startsWith('/reports') ? '#74c878' : 'transparent',
                    borderRadius: '6px',
                    marginTop: '5px'
                }}>
                    <div 
                        onClick={() => setReportsOpen(!reportsOpen)}
                        style={{
                            color: location.pathname.startsWith('/reports') ? '#ffffff' : '#718096',
                            padding: '12px 15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            fontWeight: '500',
                            fontSize: '15px',
                            cursor: 'pointer',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            <span>Reports</span>
                        </div>
                        <span>{reportsOpen ? '▾' : '▸'}</span>
                    </div>
                </li>
                
                {reportsOpen && (
                    <div style={{ marginLeft: '15px', marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: '1px solid #edf2f7', paddingLeft: '10px' }}>
                        {reportRoutes.map(subItem => {
                            const isSubActive = location.pathname === subItem.path;
                            return (
                                <li key={subItem.name} style={{
                                    backgroundColor: isSubActive ? '#edf2f7' : 'transparent',
                                    borderRadius: '4px',
                                }}>
                                    <Link to={subItem.path} style={{
                                        color: isSubActive ? '#4a5568' : '#a0aec0',
                                        textDecoration: 'none',
                                        padding: '10px 15px',
                                        display: 'block',
                                        fontSize: '13px',
                                        fontWeight: '500'
                                    }}>
                                        {subItem.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </div>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
