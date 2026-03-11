import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import avatarLogo from '../Aveti Logo.png'; // Assuming it's in src/

const Sidebar = () => {
    const location = useLocation();
    const [reportsOpen, setReportsOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Employees', path: '/members' }, 
        { name: 'Books', path: '/books' },
    ];

    const reportRoutes = [
        { name: '> Employee Report', path: '/reports/employees' },
        { name: '> Books Report', path: '/reports/available-books' },
        { name: '> Issued Books Report', path: '/reports/issued-books' },
    ];

    return (
        <div style={{
            width: '250px',
            backgroundColor: '#2d3748',
            color: 'white',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ padding: '30px', textAlign: 'center', borderBottom: '1px solid #4a5568' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#e2e8f0',
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
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {menuItems.map(item => {
                    const isActive = location.pathname === item.path;
                    return (
                        <li key={item.name} style={{
                            borderBottom: '1px solid #4a5568',
                            backgroundColor: isActive ? '#1a202c' : 'transparent',
                            borderLeft: isActive ? '4px solid #4299e1' : '4px solid transparent'
                        }}>
                            <Link to={item.path} style={{
                                color: isActive ? '#4299e1' : '#cbd5e0',
                                textDecoration: 'none',
                                padding: '15px 20px',
                                display: 'block',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>
                                {item.name}
                            </Link>
                        </li>
                    )
                })}
                
                {/* Generate Reports Dropdown */}
                <li style={{
                    borderBottom: '1px solid #4a5568',
                    backgroundColor: location.pathname.startsWith('/reports') ? '#1a202c' : 'transparent',
                    borderLeft: location.pathname.startsWith('/reports') ? '4px solid #4299e1' : '4px solid transparent'
                }}>
                    <div 
                        onClick={() => setReportsOpen(!reportsOpen)}
                        style={{
                            color: location.pathname.startsWith('/reports') ? '#4299e1' : '#cbd5e0',
                            padding: '15px 20px',
                            display: 'block',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        Generate Reports <span>{reportsOpen ? '▾' : '▸'}</span>
                    </div>
                </li>
                
                {reportsOpen && reportRoutes.map(subItem => {
                    const isSubActive = location.pathname === subItem.path;
                    return (
                        <li key={subItem.name} style={{
                            backgroundColor: '#2d3748',
                            borderBottom: '1px solid #4a5568',
                        }}>
                             <Link to={subItem.path} style={{
                                color: isSubActive ? '#ffffff' : '#cbd5e0',
                                textDecoration: 'none',
                                padding: '10px 20px 10px 35px',
                                display: 'block',
                                fontSize: '13px'
                            }}>
                                {subItem.name}
                            </Link>
                        </li>
                    )
                })}

            </ul>
        </div>
    );
};

export default Sidebar;
