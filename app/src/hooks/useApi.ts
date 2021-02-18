import { useEffect, useState } from 'react';
import { useAuth0, OAuthError } from '@auth0/auth0-react';

interface UseApiOptions {
  audience: string;
  scope?: string;
  fetchOptions?: FetchOptions;
}

interface FetchOptions {
  headers: {};
}

interface UseApiState {
  error: OAuthError | { error: string; message: string };
  loading: boolean;
  data: {};
}

const useApiState: UseApiState = {
    error: { error: 'no error', message: 'no message' },
    loading: true,
    data: {},
  }

export const useApi = (url: string, options: UseApiOptions) => {
  const { getAccessTokenSilently } = useAuth0();
  const [state, setState] = useState(useApiState);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { audience, scope, ...fetchOptions } = options;
        const accessToken = await getAccessTokenSilently({ audience, scope });
        const res = await fetch(url, {
          ...fetchOptions,
          headers: {
            // ...fetchOptions.headers,
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setState({
          ...state,
          data: await res.json(),
          error: { error: 'no error', message: 'no message' },
          loading: false,
        });
      } catch (error) {
        setState({
          ...state,
          error,
          loading: false,
        });
      }
    })();
  }, [refreshIndex, getAccessTokenSilently, options, state, url]);

  return {
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};
