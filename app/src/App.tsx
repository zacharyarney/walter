import React from 'react';
import './App.css';
import { LoginButton } from './components/LoginButton/LoginButton';
import { Profile } from './components/Profile/Profile';

function App() {
  return (
    <div className="App">
      <LoginButton />
      <Profile />
    </div>
  );
}

export default App;
