// src/components/Layout.js
import React from 'react';
import NavBar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <NavBar />
            <main style={{ padding: '20px', marginTop: '64px' }}>
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
