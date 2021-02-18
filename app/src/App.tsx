import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';
import { LoginButton } from './components/LoginButton/LoginButton';
import { Profile } from './components/Profile/Profile';

function App() {
  const { isAuthenticated } = useAuth0();
  const profile = isAuthenticated ? (<Profile />) : null;
  return (
    <div className="App">
      <LoginButton />
      {profile}
    </div>
  );
}

export default App;
