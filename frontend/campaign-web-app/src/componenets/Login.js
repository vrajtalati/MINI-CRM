import React from 'react';
import './login.css';

const Login = () => {

    const loginwithgoogle = () => {
        window.open("http://localhost:5000/auth/google/callback", "_self");
    }

    return (
        <>
            <div className="login-page">
                <h1>Mini CRM</h1>
                <div className="form">
                    <button className='login-with-google-btn' onClick={loginwithgoogle}>
                        Sign In With Google
                    </button>
                </div>
            </div>
            <footer>
                Made by Vraj Talati
            </footer>
        </>
    );
}

export default Login;
