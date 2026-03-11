import React from 'react';

const Dashboard = () => {
    const cardStyle = {
        padding: '30px',
        backgroundColor: '#ffffff', // One consistent light color
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '4px solid #4299e1' // A small accent color line based on the top menu
    };

    const titleStyle = { color: '#a0aec0', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '15px' };
    const numStyle = { color: '#2d3748', fontSize: '28px', fontWeight: 'bold', marginTop: '5px' };

    return (
        <div>
            <h1 style={{ color: '#718096', fontSize: '18px', marginBottom: '20px', fontWeight: 'normal', letterSpacing: '1px' }}>ADMINISTRATOR DASHBOARD</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div style={cardStyle}>
                    <div style={{ fontSize: '30px', color: '#4299e1' }}>🎓</div>
                    <p style={titleStyle}>Total Students</p>
                    <p style={numStyle}>6</p>
                </div>
                <div style={cardStyle}>
                    <div style={{ fontSize: '30px', color: '#4299e1' }}>👨‍🏫</div>
                    <p style={titleStyle}>Total Teachers</p>
                    <p style={numStyle}>3</p>
                </div>
                <div style={cardStyle}>
                    <div style={{ fontSize: '30px', color: '#4299e1' }}>📚</div>
                    <p style={titleStyle}>Total Books</p>
                    <p style={numStyle}>3</p>
                </div>
                <div style={cardStyle}>
                    <div style={{ fontSize: '30px', color: '#4299e1' }}>📖</div>
                    <p style={titleStyle}>Books Issued</p>
                    <p style={numStyle}>4</p>
                </div>
            </div>

            <div style={{ textAlign: 'center', color: '#718096', fontSize: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
                CALENDAR OF EVENTS
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '24px', margin: 0, color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>May 2026</h2>

                {/* Mock Calendar Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e2e8f0', border: '1px solid #e2e8f0', marginTop: '15px' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} style={{ padding: '10px', backgroundColor: '#ffffff', textAlign: 'center', fontWeight: 'bold', fontSize: '12px', color: '#718096' }}>{d}</div>
                    ))}
                    {/* Blank days for start of month */}
                    <div style={{ backgroundColor: '#ffffff' }}></div>
                    {/* Calendar Days */}
                    {[...Array(31)].map((_, i) => (
                        <div key={i} style={{ padding: '30px 10px 10px 10px', backgroundColor: '#ffffff', textAlign: 'right', fontSize: '12px', color: '#a0aec0', position: 'relative', minHeight: '60px' }}>
                            <span style={{ position: 'absolute', top: '5px', right: '5px' }}>{i + 1}</span>
                        </div>
                    ))}
                    {/* Blanks for end of calendar */}
                    {[...Array(3)].map((_, i) => <div key={`e${i}`} style={{ backgroundColor: '#ffffff' }}></div>)}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
