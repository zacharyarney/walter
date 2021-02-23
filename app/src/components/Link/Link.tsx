import React, { useCallback, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { usePlaidLink } from 'react-plaid-link';
import auth from '../../config/auth.config';

interface LinkProps {
  linkToken: string;
  setAccessToken: Dispatch<SetStateAction<string>>;
  auth0Id: string;
}

export function Link(props: LinkProps) {
  const onSuccess = useCallback(
    async (public_token, metadata) => {
      console.log('onSuccess');
      console.log(`${auth.walterApiUri}/set-access-token`);
      // send link token to server
      axios
        .post(`${auth.walterApiUri}/set-access-token`, {
          public_token,
          auth0Id: props.auth0Id,
        })
        .then(response => console.log('response: ', response))
        .catch(e => console.log(e));
    },
    [props.auth0Id]
  );

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: props.linkToken!,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button onClick={() => open()} disabled={!ready}>
      Link Account
    </button>
  );
}
