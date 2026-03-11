import React, { useState } from 'react';

const FeeManagement = () => {
    const [feeAmount, setFeeAmount] = useState(0);
    const [fineAmount, setFineAmount] = useState(0);

    const handleFeeChange = (e) => {
        setFeeAmount(e.target.value);
    };

    const handleFineChange = (e) => {
        setFineAmount(e.target.value);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Fee Management Configuration</h2>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'inline-block', width: '200px' }}>Set Subscription Fee Amount: </label>
                <input type="number" value={feeAmount} onChange={handleFeeChange} style={{ padding: '5px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'inline-block', width: '200px' }}>Set Daily Late Fine Amount: </label>
                <input type="number" value={fineAmount} onChange={handleFineChange} style={{ padding: '5px' }} />
            </div>
            <button style={{ padding: '10px 20px', backgroundColor: '#1a237e', color: 'white', border: 'none', borderRadius: '4px' }}>
                Save Fee Settings
            </button>
        </div>
    );
};

export default FeeManagement;
