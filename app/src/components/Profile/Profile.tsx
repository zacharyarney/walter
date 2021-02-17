import react from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogoutButton } from '../LogoutButton/LogoutButton';

export function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  console.log(user);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    <>
      <LogoutButton />
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </>
  ) : (
    <p>Psst... try logging in</p>
  );
}
