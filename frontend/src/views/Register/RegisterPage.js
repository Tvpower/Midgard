import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        try {
            const response = await axios.post('http://localhost:3001/user/register', {
                username,
                email,
                password,
            });

            if (response.status === 201) {
                navigate("/login", { replace: true }); // Redirect to login page after successful registration
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setLoginError('Invalid login credentials');
                } else {
                    setLoginError('An error occurred. Please try again later.');
                }
            } else if (error.request) {
                setLoginError('No response from server. Please try again later.');
            } else {
                setLoginError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div id="home" className="homeDiv">
            <video autoPlay muted loop id="backgroundVideo">
                <source
                    src="https://res.cloudinary.com/hcv8opupx/video/upload/v1723243584/AdobeStock_570132261_s39xqq.mp4"
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
            <div className="overlay-content"></div>
            <nav>
                <img src="/image_2024-10-06_115327155-removebg-preview.png" className="logo" alt="Logo" />
            </nav>
            <div className="content">
                <div className="leftSide">
                    <div className="formContainer-register">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="string"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit" className="register-button">Register</button>
                            {loginError && <p className="error">{loginError}</p>}
                            <div className="link-group">
                                <a href="/">Already have an Account?</a>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="infoSide">
                    <h1>Midgard</h1>
                    <p className="par">Your center of learning.</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;