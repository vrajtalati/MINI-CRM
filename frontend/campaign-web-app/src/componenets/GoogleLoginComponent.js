import React, { useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios';

const GoogleLoginComponent = () => {
  const [user, setUser] = useState(null);

  const responseGoogle = (response) => {
    console.log(response);

    // Send the token to the backend
    axios.post('http://localhost:5000/auth/google', {
      token: response.tokenId
    })
    .then(res => {
      setUser(res.data.user); // Set the user state with response from backend
    })
    .catch(error => {
      console.error('Error during authentication', error);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <GoogleLogout
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={logout}
          />
        </div>
      ) : (
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Login with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      )}
    </div>
  );
};

export default GoogleLoginComponent;
