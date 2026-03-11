import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; // Updated URL based on our Node.js app.js

// API for fetching all books
export const fetchBooks = () => axios.get(`${BASE_URL}/books`);

export const fetchMembers = () => axios.get(`${BASE_URL}/members`);

// Keeping original borrowBook signature from instructions, but updating URL and payload structure slightly if needed.
export const borrowBook = (bookId, userId) => axios.post(`${BASE_URL}/issue`, {
    member_id: userId,
    accession_no: bookId // Adapting to the new ILS backend
});

// API for returning a book
export const returnBook = (bookId, userId) => axios.post(`${BASE_URL}/return`, { accession_no: bookId });

export const addBook = (data) => axios.post(`${BASE_URL}/books`, data);
export const getAvailableAccession = (title) => axios.get(`${BASE_URL}/books/${title}/available-accession`);
export const getStudentDetails = (enrollment) => axios.get(`${BASE_URL}/students/${enrollment}`);
