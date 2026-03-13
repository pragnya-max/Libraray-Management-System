import React, { useState } from 'react';

const Employees = ({ employees, setEmployees }) => {
    const [showNewModal, setShowNewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Unified form data for both New and Edit
    const [formData, setFormData] = useState({
        name: '', idCardNo: '', contact: '', email: '', position: '', status: 'Active', password: '1234'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOpenEdit = (employee, viewOnly = false) => {
        setEditingEmployee(employee);
        setFormData({ ...employee });
        setIsViewMode(viewOnly);
        setShowEditModal(true);
    };

    const handleOpenNew = () => {
        setEditingEmployee(null);
        setFormData({ name: '', idCardNo: '', contact: '', email: '', position: '', status: 'Active', password: '1234' });
        setIsViewMode(false);
        setShowNewModal(true);
    };

    const handleDelete = (id) => {
        setEmployees(employees.filter(e => e.id !== id));
    };

    const handleAddSubmit = () => {
        if (!formData.name) return;
        const newEmployee = {
            id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
            ...formData
        };
        setEmployees([...employees, newEmployee]);
        setShowNewModal(false);
    };

    const handleEditSubmit = () => {
        if (!formData.name) return;
        setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, ...formData } : e));
        setShowEditModal(false);
    };

    const filteredEmployees = employees.filter(e => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.idCardNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748', margin: 0 }}>Employees Management</h1>
                <button
                    onClick={handleOpenNew}
                    style={{
                        backgroundColor: '#4299e1',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    NEW EMPLOYEE
                </button>
            </div>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search name or ID...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}
            />

            {/* Employees Table */}
            <div style={{ backgroundColor: 'white', borderTop: '2px solid #e2e8f0', borderBottom: '2px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', backgroundColor: 'white', color: '#4a5568', padding: '15px' }}>EMPLOYEE NAME</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568', padding: '15px' }}>ID CARD NUMBER</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568', padding: '15px' }}>CONTACT</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568', padding: '15px' }}>EMAIL ADDRESS</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568', padding: '15px' }}>POSITION</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568', padding: '15px' }}>STATUS</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568', padding: '15px' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(e => (
                            <tr key={e.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: e.id % 2 === 0 ? '#ffffff' : '#f7fafc' }}>
                                <td style={{ textAlign: 'left', padding: '15px' }}>{e.name}</td>
                                <td style={{ textAlign: 'center', color: '#718096', padding: '15px' }}>{e.idCardNo}</td>
                                <td style={{ textAlign: 'center', color: '#718096', padding: '15px' }}>{e.contact}</td>
                                <td style={{ textAlign: 'center', color: '#718096', padding: '15px' }}>{e.email}</td>
                                <td style={{ textAlign: 'center', color: '#718096', padding: '15px' }}>{e.position}</td>
                                <td style={{ textAlign: 'center', color: '#718096', padding: '15px' }}>{e.status}</td>
                                <td style={{ textAlign: 'center', padding: '15px' }}>
                                    <button onClick={() => handleOpenEdit(e, false)} style={{ backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', margin: '0 2px', cursor: 'pointer' }}>✎</button>
                                    <button onClick={() => handleOpenEdit(e, true)} style={{ backgroundColor: '#48bb78', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', margin: '0 2px', cursor: 'pointer' }}>👁</button>
                                    <button onClick={() => handleDelete(e.id)} style={{ backgroundColor: '#f56565', color: 'white', border: 'none', padding: '5px', width: '30px', borderRadius: '4px', margin: '0 2px', cursor: 'pointer' }}>✖</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            <div style={{ display: 'flex', gap: '5px', marginTop: '20px' }}>
                <button style={{ padding: '5px 10px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}>«</button>
                <button style={{ padding: '5px 10px', border: '1px solid #e2e8f0', color: 'black', backgroundColor: 'white', cursor: 'pointer' }}>1</button>
                <button style={{ padding: '5px 10px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}>»</button>
            </div>

            {/* NEW/EDIT Modal */}
            {(showNewModal || showEditModal) && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'white', width: '600px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <div style={{ backgroundColor: '#4299e1', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>
                                {isViewMode ? 'VIEW' : (showNewModal ? 'NEW' : 'EDIT')} EMPLOYEE
                            </h3>
                            <button onClick={() => { setShowNewModal(false); setShowEditModal(false); }} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'white' }}>✖</button>
                        </div>
                        <div style={{ padding: '25px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#4a5568', marginBottom: '5px', fontWeight: '600' }}>Full Name:</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#4a5568', marginBottom: '5px', fontWeight: '600' }}>ID Card Number:</label>
                                    <input type="text" name="idCardNo" value={formData.idCardNo} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#4a5568', marginBottom: '5px', fontWeight: '600' }}>Contact:</label>
                                    <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#4a5568', marginBottom: '5px', fontWeight: '600' }}>Email Address:</label>
                                    <input type="text" name="email" value={formData.email} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#4a5568', marginBottom: '5px', fontWeight: '600' }}>Password / PIN:</label>
                                    <input type="text" name="password" value={formData.password} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#4a5568', marginBottom: '5px', fontWeight: '600' }}>Position:</label>
                                    <input type="text" name="position" value={formData.position} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#4a5568', marginBottom: '5px', fontWeight: '600' }}>Account Status:</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', height: '42px' }}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            
                            {!isViewMode && (
                                <div style={{ textAlign: 'right' }}>
                                    <button onClick={showNewModal ? handleAddSubmit : handleEditSubmit} style={{ backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                                        {showNewModal ? 'ADD EMPLOYEE' : 'UPDATE ACCOUNT'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
