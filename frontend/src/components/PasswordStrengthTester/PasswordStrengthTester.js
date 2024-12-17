import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const PasswordStrengthTester = () => {
    const [password, setPassword] = useState('');
    const [strengthMessage, setStrengthMessage] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [currentStrength, setCurrentStrength] = useState(0);

    const evaluateStrength = (pwd) => {
        let strength = 0;
        const messages = [
            "Very Weak: Try adding more characters.",
            "Weak: Add numbers or symbols.",
            "Moderate: Use upper and lowercase letters, numbers, and symbols.",
            "Strong: Good job! Try making it longer for extra security.",
            "Very Strong: Your password is excellent!"
        ];

        // Check password criteria
        if (pwd.length >= 8) strength += 1;
        if (/[A-Z]/.test(pwd)) strength += 1;
        if (/[a-z]/.test(pwd)) strength += 1;
        if (/[0-9]/.test(pwd)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;

        // Update best score if current strength is higher
        if (strength > bestScore) {
            setBestScore(strength);
        }

        setCurrentStrength(strength);
        setStrengthMessage(messages[strength] || "Very Weak");

        // Track attempt
        if (!isCompleted) {
            setAttempts(prev => prev + 1);
        }
    };

    const submitProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Starting submitProgress with score:', bestScore);

            if (!token) {
                console.error('No token found in localStorage');
                return;
            }

            const payload = {
                activityType: 'passwordTester',
                score: Math.round((bestScore / 4) * 100)
            };
            console.log('Sending payload:', payload);

            const response = await axios.post(
                'http://localhost:3001/user/progress',
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Response from server:', response.data);

            if (response.data.success) {
                alert(`Progress saved! Score: ${payload.score}%`);
                setIsCompleted(true);
            } else {
                console.error('Progress update failed:', response.data);
                alert('Failed to save progress. Please try again.');
            }
        } catch (error) {
            console.error('Error in submitProgress:', error.response || error);
            console.log('Full error object:', error);
            alert('Error saving progress. Check console for details.');
        }
    };

    const handlePasswordChange = (e) => {
        const pwd = e.target.value;
        setPassword(pwd);
        evaluateStrength(pwd);
    };

    return (
        <div className="password-strength-tester">
            <h2>Password Strength Tester</h2>
            <input
                type="password"
                placeholder="Enter a password"
                value={password}
                onChange={handlePasswordChange}
            />
            <p>Password Strength: <strong>{strengthMessage}</strong></p>
            <p>Current Score: {currentStrength}/4</p>

            {!isCompleted && (
                <button
                    onClick={submitProgress}
                    className="submit-button"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Submit Score
                </button>
            )}

            {isCompleted && (
                <p>Activity completed! Best strength achieved: {bestScore}/4</p>
            )}
            <p>Attempts: {attempts}</p>
        </div>
    );
};

export default PasswordStrengthTester;