import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogoutButton } from '../LogoutButton/LogoutButton';
import auth from '../../config/auth.config';

export function Profile() {
  const { user, isLoading, getAccessTokenSilently } = useAuth0();
  // const [publicMessage, setPublicMessage] = useState('');
  const [protectedMessage, setProtectedMessage] = useState('');

  const getMessage = async () => {
    try {
      const messageResponse = await fetch(auth.walterApiUri);

      const { message } = await messageResponse.json();

      setProtectedMessage(message);
    } catch (e) {
      console.log(e);
    }
  };

  const getProtectedMessage = async () => {
    // this portion can probably be made into a hook.
    const accessToken = await getAccessTokenSilently({
      audience: auth.audience,
    });

    try {
      const messageResponse = await fetch(`${auth.walterApiUri}/private`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { message } = await messageResponse.json();

      setProtectedMessage(message);
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <LogoutButton />
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => getProtectedMessage()}>
        Get Protected Message
      </button>
      <button onClick={() => getMessage()}>Get Message</button>
      {protectedMessage ? <p>{protectedMessage}</p> : null}
    </>
  );
}
