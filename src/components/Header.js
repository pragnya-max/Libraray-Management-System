import React from 'react';

const Header = () => {
    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px 40px',
            backgroundColor: '#e6dfd7' // Matches the body background 
        }}>
            {/* Mocking the book stack logo with emoji since we don't have the explicit image */}
            <div style={{ fontSize: '60px', marginRight: '20px', lineHeight: 1 }}>
                📚
            </div>
            <div>
                <h1 style={{
                    margin: 0,
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#f07b05',
                    textTransform: 'uppercase',
                    lineHeight: '1.1'
                }}>
                    Library
                </h1>
                <h2 style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: 'normal',
                    color: '#888',
                    textTransform: 'uppercase',
                    lineHeight: '1.1',
                    letterSpacing: '1px'
                }}>
                    Management System
                </h2>
            </div>
        </header>
    );
};

export default Header;
