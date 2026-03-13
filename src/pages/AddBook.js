import React, { useState } from 'react';
import { addBook } from '../services/api';

const AddBook = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        purchase_date: '',
        price: '',
        quantity: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await addBook(formData);
            alert(`Saved successfully! ${formData.quantity} physical copies created in ILS.`);
            setFormData({ title: '', author: '', purchase_date: '', price: '', quantity: '' });
        } catch (error) {
            alert('Failed to save book');
        }
    };

    return (
        <div style={{ backgroundColor: '#fcdcb3', height: '100vh' }}>
            {/* Header matches screenshot: Tan background, Book icon, Add Book text */}
            <div style={{ backgroundColor: '#f0caa3', padding: '15px 30px', display: 'flex', alignItems: 'center' }}>
                <span role="img" aria-label="book" style={{ fontSize: '30px', marginRight: '15px', color: '#d35400' }}>📙</span>
                <h1 style={{ margin: 0, fontSize: '24px', color: '#000' }}>Add Book</h1>
            </div>

            {/* Form Container */}
            <div style={{ padding: '40px', maxWidth: '600px' }}>
                <div style={{ display: 'flex', marginBottom: '15px', alignItems: 'center' }}>
                    <label style={{ width: '200px', fontSize: '16px' }}>Book Name</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} style={{ flex: 1, padding: '5px' }} />
                </div>

                <div style={{ display: 'flex', marginBottom: '15px', alignItems: 'center' }}>
                    <label style={{ width: '200px', fontSize: '16px' }}>Book Author Name</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} style={{ flex: 1, padding: '5px' }} />
                </div>


                <div style={{ display: 'flex', marginBottom: '15px', alignItems: 'center' }}>
                    <label style={{ width: '200px', fontSize: '16px' }}>Book Purchase Date</label>
                    <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} style={{ flex: 1, padding: '5px' }} />
                </div>

                <div style={{ display: 'flex', marginBottom: '15px', alignItems: 'center' }}>
                    <label style={{ width: '200px', fontSize: '16px' }}>Book Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} style={{ flex: 1, padding: '5px' }} />
                </div>

                <div style={{ display: 'flex', marginBottom: '25px', alignItems: 'center' }}>
                    <label style={{ width: '200px', fontSize: '16px' }}>Book Quantity</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} style={{ flex: 1, padding: '5px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    <button onClick={handleSave} style={{ padding: '8px 25px', backgroundColor: '#f0caa3', border: '1px solid #795548', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                    <button onClick={() => setFormData({ title: '', author: '', purchase_date: '', price: '', quantity: '' })} style={{ padding: '8px 25px', backgroundColor: '#f0caa3', border: '1px solid #795548', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddBook;
