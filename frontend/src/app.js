import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import axios from 'axios';
import LoginPage from "./views/Login/LoginPage.js";
import ContentPage from "./views/Content/ContentPage.js";
import RegisterPage from './views/Register/RegisterPage.js';
import HomePage from './views/Home/HomePage.js';
import SettingsPage from './views/Settings/SettingsPage.js';
import AuthService from './services/auth.service.js';
import { ToolsPage, URLScannerPage } from './views/tools/index.js';
import PasswordGeneratorPage from './views/tools/passwordPage/passwordGenerator.js';



axios.defaults.baseURL = 'http://localhost:3001/user';

const App = () => {
    const [isAuthenticated, setAuthentication] = useState(false);
    // const [username, setUsername] = useState(null);

    async function fetchData(token) {
        try {
            if (token) {
                console.log('Attempting to fetch user data with token:', token);
                const response = await axios.get('/profile', {
                    headers: {
                        Authorization: token,
                    }
                });
                console.log('Response received:', response.data);

                const username = response.data.userData.username;
                const email = response.data.userData.email;
                localStorage.setItem('username', username);
                localStorage.setItem('email', email);
                setAuthentication(true);
            } else {
                console.log('No token found');
                setAuthentication(false);
            }
        } catch (error) {
            console.error('Fetch data error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setAuthentication(false);
            localStorage.removeItem('token'); // Clear invalid token
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchData(token);
        }
    }, []);

    const handleLogout = async () => {
        await AuthService.logout();
        setAuthentication(false);
    };



    //still lacking logic to stop from navigating straigh to content through search bar without being logged in
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage />} />
                    <Route path="/content" element={isAuthenticated ? <ContentPage /> : <Navigate to="/content" />}/>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}/>
                    <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
                    {/* Default route that redirects to Dashboard or Login based on authentication */}
                    <Route path="/" element={isAuthenticated ? <Navigate to="/content" /> : <Navigate to="/login" />} />
                    <Route path="/tools" element={isAuthenticated ? <ToolsPage /> : <Navigate to="/login" />} />
                    <Route path="/tools/url-scanner" element={isAuthenticated ? <URLScannerPage /> : <Navigate to="/tools" />} />
                    <Route path="/tools/password-generator" element={isAuthenticated ? <PasswordGeneratorPage /> : <Navigate to="/tools" />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;