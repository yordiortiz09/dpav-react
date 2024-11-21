// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PerrosList from './components/PerrosList';
import RazasList from './components/RazasList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const App = () => {
    return (
        <Router>
            <Routes>
                {}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />

                {}
                <Route path="/" element={<Layout />}>
                    <Route path="perros" element={<PerrosList />} />
                    <Route path="razas" element={<RazasList />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
