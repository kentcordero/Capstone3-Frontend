import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const user = {};

    return (
        <nav>
            <ul>
                {user?.isAdmin ? (
                    <>
                        <li><Link to="/dashboard">Admin Dashboard</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/products">Products Catalog</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                    </>
                )}
                 <li><Link to="/logout">Logout</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;