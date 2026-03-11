import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="orange-navbar">
            <ul className="nav-menu">
                <li className="nav-item">
                    <Link to="/dashboard">HOME</Link>
                </li>
                <li className="nav-item dropdown">
                    <span className="dropbtn">INVENTORY ▼</span>
                    <div className="dropdown-content">
                        <Link to="/books">Book List</Link>
                        <Link to="/add-book">Add Book</Link>
                    </div>
                </li>
                <li className="nav-item dropdown">
                    <span className="dropbtn active-menu">BOOKTRANSACTION</span>
                    <div className="dropdown-content">
                        <Link to="/issue-book">Book Issue</Link>
                        <Link to="/books">Book Return</Link>
                        <Link to="/books">Remove Book</Link>
                        <Link to="/search">Search Book</Link>
                    </div>
                </li>
                <li className="nav-item dropdown">
                    <span className="dropbtn">ADMINISTRATOR ▼</span>
                    <div className="dropdown-content">
                        <Link to="/members">Members</Link>
                        <Link to="/fees">Fee Management</Link>
                    </div>
                </li>
                <li className="nav-item dropdown">
                    <span className="dropbtn">REPORTS ▼</span>
                    <div className="dropdown-content">
                        <Link to="/dashboard">Stock Reports</Link>
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
