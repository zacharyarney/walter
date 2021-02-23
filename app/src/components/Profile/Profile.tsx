import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Auth0UserProfile } from 'auth0-js';
import { LogoutButton } from '../LogoutButton/LogoutButton';
import auth from '../../config/auth.config';
import { Link } from '../Link/Link';

interface WalterUser extends Auth0UserProfile {
  auth0Id: string;
}

export function Profile() {
  const { user, isLoading, getAccessTokenSilently } = useAuth0();
  // TODO: create type for walterUser
  const [walterUser, setWalterUser] = useState<WalterUser>({
    auth0Id: '',
    name: '',
    nickname: '',
    username: '',
    user_id: '',
    picture: '',
    clientID: '',
    sub: '',
    created_at: '',
    updated_at: '',
    identities: [],
  });
  const [linkToken, setLinkToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [protectedMessage, setProtectedMessage] = useState('');

  useEffect(() => {
    const setAxiosAuthHeader = async () => {
      if (user) {
        const auth0AccessToken = await getAccessTokenSilently({
          audience: auth.audience,
        });
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${auth0AccessToken}`;
      }
    };

    const getUserFromDb = async () => {
      try {
        const userWithAuth0Id = { ...user, auth0Id: user.sub };
        const appUser = await axios.post(
          `${auth.walterApiUri}/login`,
          userWithAuth0Id
        );
        setWalterUser({ ...appUser.data });
      } catch (err) {
        console.error(err);
      }
    };

    setAxiosAuthHeader().then(() => getUserFromDb());
  }, [getAccessTokenSilently, user]);

  const getLinkToken = async () => {
    try {
      const linkToken = await axios.post(
        `${auth.walterApiUri}/create-link-token`,
        { auth0Id: walterUser.auth0Id }
      );
      setLinkToken(linkToken.data.linkToken);
      console.log('linkToken: ', linkToken);
    } catch (err) {
      console.error(err);
    }
  };

  const getMessage = async () => {
    try {
      const messageResponse = await axios.get(auth.walterApiUri);

      const { message } = await messageResponse.data;

      setProtectedMessage(message);
    } catch (err) {
      console.log(err);
    }
  };

  const getProtectedMessage = async () => {
    try {
      const messageResponse = await axios.get(`${auth.walterApiUri}/private`);

      const { message } = await messageResponse.data;

      setProtectedMessage(message);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <LogoutButton />
      <img src={walterUser.picture} alt={walterUser.name} />
      <h2>{walterUser.name}</h2>
      <p>{walterUser.email}</p>
      <button onClick={() => getProtectedMessage()}>
        Get Protected Message
      </button>
      <button onClick={() => getMessage()}>Get Message</button>
      {protectedMessage ? <p>{protectedMessage}</p> : null}
      <button onClick={() => getLinkToken()}>GET LINK TOKEN</button>
      <Link
        linkToken={linkToken}
        setAccessToken={setAccessToken}
        auth0Id={walterUser.auth0Id}
      />
    </>
  );
}
