import React, { useState } from 'react';

const Employees = ({ employees, setEmployees }) => {
    const [showNewModal, setShowNewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    // Unified form data for both New and Edit
    const [formData, setFormData] = useState({
        name: '', idCardNo: '', contact: '', email: '', position: '', status: 'Active'
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
        setFormData({ name: '', idCardNo: '', contact: '', email: '', position: '', status: 'Active' });
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

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={handleOpenNew}
                style={{
                    backgroundColor: '#4299e1',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                NEW EMPLOYEE
            </button>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search name...."
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
                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', backgroundColor: 'white', color: '#4a5568' }}>EMPLOYEE NAME</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568' }}>ID CARD NUMBER</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568' }}>CONTACT</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568' }}>EMAIL ADDRESS</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568' }}>POSITION</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568' }}>STATUS</th>
                            <th style={{ textAlign: 'center', backgroundColor: 'white', color: '#4a5568' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(e => (
                            <tr key={e.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: e.id % 2 === 0 ? '#ffffff' : '#f7fafc' }}>
                                <td style={{ textAlign: 'left' }}>{e.name}</td>
                                <td style={{ textAlign: 'center', color: '#718096' }}>{e.idCardNo}</td>
                                <td style={{ textAlign: 'center', color: '#718096' }}>{e.contact}</td>
                                <td style={{ textAlign: 'center', color: '#718096' }}>{e.email}</td>
                                <td style={{ textAlign: 'center', color: '#718096' }}>{e.position}</td>
                                <td style={{ textAlign: 'center', color: '#718096' }}>{e.status}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button onClick={() => handleOpenEdit(e, false)} style={{ backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', margin: '0 2px', cursor: 'pointer' }}>✎</button>
                                    <button onClick={() => handleOpenEdit(e, true)} style={{ backgroundColor: '#48bb78', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', margin: '0 2px', cursor: 'pointer' }}>👁</button>
                                    <button onClick={() => handleDelete(e.id)} style={{ backgroundColor: '#f56565', color: 'white', border: 'none', padding: '5px', width: '25px', borderRadius: '4px', margin: '0 2px', cursor: 'pointer' }}>✖</button>
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

            {/* NEW EMPLOYEE Modal */}
            {showNewModal && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '50px', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'white', width: '600px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                        <div style={{ backgroundColor: '#4299e1', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#4a5568', fontSize: '16px' }}>NEW EMPLOYEE</h3>
                            <button onClick={() => setShowNewModal(false)} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#4a5568' }}>✖</button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Full name:</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #90cdf4', borderRadius: '4px', outline: 'none' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>ID Card Number:</label>
                                    <input type="text" name="idCardNo" value={formData.idCardNo} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Contact:</label>
                                    <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Email Address:</label>
                                    <input type="text" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Position:</label>
                                    <input type="text" name="position" value={formData.position} onChange={handleInputChange} placeholder="e.g. Teacher, Staff" style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                                </div>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                                <button onClick={handleAddSubmit} style={{ backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>ADD EMPLOYEE</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT/VIEW EMPLOYEE Modal */}
            {showEditModal && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '50px', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'white', width: '600px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                        <div style={{ backgroundColor: '#4299e1', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#4a5568', fontSize: '16px' }}>{isViewMode ? 'VIEW EMPLOYEE' : 'EDIT EMPLOYEE'}</h3>
                            <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#4a5568' }}>✖</button>
                        </div>
                        <div style={{ padding: '30px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px', fontWeight: 'bold' }}>Full Name:</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', color: '#4a5568', backgroundColor: isViewMode ? '#f7fafc' : 'white' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px', fontWeight: 'bold' }}>ID Card Number:</label>
                                    <input type="text" name="idCardNo" value={formData.idCardNo} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', color: '#4a5568', backgroundColor: isViewMode ? '#f7fafc' : 'white' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px', fontWeight: 'bold' }}>Contact:</label>
                                    <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', color: '#4a5568', backgroundColor: isViewMode ? '#f7fafc' : 'white' }} />
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px', fontWeight: 'bold' }}>Email Address:</label>
                                    <input type="text" name="email" value={formData.email} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', color: '#4a5568', backgroundColor: isViewMode ? '#f7fafc' : 'white' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px', fontWeight: 'bold' }}>Position:</label>
                                    <input type="text" name="position" value={formData.position} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', color: '#4a5568', backgroundColor: isViewMode ? '#f7fafc' : 'white' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '30px', width: '50%' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#718096', marginBottom: '5px', fontWeight: 'bold' }}>Status:</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} disabled={isViewMode} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', color: '#4a5568', backgroundColor: isViewMode ? '#f7fafc' : 'white' }}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            {!isViewMode && (
                                <div style={{ textAlign: 'right' }}>
                                    <button onClick={handleEditSubmit} style={{ backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>UPDATE ACCOUNT</button>
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
