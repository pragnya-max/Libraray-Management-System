import React, { useState } from 'react';
import axios from 'axios';

const SearchBooks = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);

    const handleSearch = async () => {
        try {
            // Hit our new OPAC search endpoint
            const response = await axios.get(`http://localhost:5000/api/opac/search?q=${searchQuery}`);
            setBooks(response.data || []);
        } catch (error) {
            console.error("Error searching books", error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Search Books (OPAC)</h2>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by title or author"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px', width: '300px', marginRight: '10px' }}
                />
                <button onClick={handleSearch} style={{ padding: '8px 16px' }}>Search</button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {books.map(book => (
                    <li key={book.id} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
                        <strong>{book.title}</strong> by {book.author} <br />
                        <span style={{ fontSize: '13px', color: '#666' }}>ISBN: {book.isbn} | Location: Rack {book.rack_no}, Shelf {book.shelf_no}</span>
                    </li>
                ))}
                {books.length === 0 && searchQuery && <li>No results found.</li>}
            </ul>
        </div>
    );
};

export default SearchBooks;
