import React, { useEffect, useState } from 'react';
import { fetchMembers } from '../services/api';

const MemberList = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await fetchMembers();
                setMembers(response.data || []);
            } catch (error) {
                console.error("Error fetching members", error);
            }
        };
        getMembers();
    }, []);

    return (
        <div style={{ padding: '40px', backgroundColor: '#f3e5f5', minHeight: 'calc(100vh - 150px)', color: '#4a148c' }}>
            <h2 style={{ borderBottom: '3px solid #7b1fa2', paddingBottom: '10px' }}>Members List</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <thead style={{ backgroundColor: '#9c27b0', color: 'white' }}>
                    <tr style={{ textAlign: 'left' }}>
                        <th style={{ padding: '15px' }}>Member Name</th>
                        <th style={{ padding: '15px' }}>Subscription Type</th>
                        <th style={{ padding: '15px' }}>Status</th>
                        <th style={{ padding: '15px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member, index) => (
                        <tr key={member.id} style={{ backgroundColor: index % 2 === 0 ? '#f3e5f5' : '#ffffff' }}>
                            <td style={{ padding: '15px', borderBottom: '1px solid #e1bee7', fontWeight: 'bold' }}>{member.name}</td>
                            <td style={{ padding: '15px', borderBottom: '1px solid #e1bee7' }}>{member.subscription_type}</td>
                            <td style={{ padding: '15px', borderBottom: '1px solid #e1bee7' }}>
                                <span style={{ backgroundColor: member.application_status === 'Active' ? '#ce93d8' : '#e0e0e0', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', color: '#4a148c', fontWeight: 'bold' }}>{member.application_status}</span>
                            </td>
                            <td style={{ padding: '15px', borderBottom: '1px solid #e1bee7' }}>
                                <button style={{ backgroundColor: '#ba68c8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Deactivate</button>
                                <button style={{ backgroundColor: '#7b1fa2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', marginLeft: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Renew</button>
                            </td>
                        </tr>
                    ))}
                    {members.length === 0 && (
                        <tr><td colSpan="4" style={{ padding: '15px', textAlign: 'center', color: '#7b1fa2', fontWeight: 'bold' }}>No members found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MemberList;
