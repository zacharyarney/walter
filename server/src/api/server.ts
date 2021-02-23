import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import plaid from 'plaid';
import { checkJwt } from '../middleware/checkJwt';
import banking from '../config/banking.config';
import * as users from './dao/users/users';

export const app = express();

const plaidClient = new plaid.Client({
  clientID: banking.clientId,
  secret: banking.sandboxSecret,
  env: plaid.environments.sandbox,
  options: {},
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(checkJwt);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Hello, world!',
  });
});

app.get('/private', (req, res) => {
  res.json({
    message: 'You should only be able to see this if you are authorized.',
  });
});

app.post('/login', (req, res, next) => {
  const { auth0Id }: { auth0Id: string } = req.body;

  users
    .getUserByAuth0Id(auth0Id)
    .then(user => {
      if (user === null) {
        users
          .createUser(req.body)
          .then(user => {
            res.status(200).json(user);
          })
          .catch(err => {
            throw new Error(err);
          });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => res.status(500).json(err));
});

// Plaid - create link token
app.post('/create-link-token', async (req, res) => {
  try {
    // Get the client_user_id by searching for the current user
    const user = await users.getUserByAuth0Id(req.body.auth0Id);
    const clientUserId = user.auth0Id;
    // Create the link_token with all of your configurations
    plaidClient
      .createLinkToken({
        user: {
          client_user_id: clientUserId,
        },
        client_name: 'Walter',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
      })
      .then(tokenRes => {
        res.status(200).json({ linkToken: tokenRes.link_token });
      })
      .catch(err => res.json(err));
  } catch (err) {
    // Display error on client
    return res.json({ error: err.message });
  }
});

// Plaid set access token
app.post('/set-access-token', (req, res) => {
  const { public_token, auth0Id } = req.body;

  console.log('public_token: ', public_token);

  plaidClient.exchangePublicToken(public_token, (err, tokenResponse) => {
    if (err) {
      res.json(err);
    }

    console.log('tokenResponse: ', tokenResponse);

    users.addNewAccessToken(auth0Id, tokenResponse);

    res.status(200).json({
      accessToken: tokenResponse.access_token,
      itemId: tokenResponse.item_id,
      error: null,
    });
  });
});

// Plaid get accounts
app.post('/accounts', async (req, res) => {
  const user = await users.getUserItems(req.body.auth0Id);
  plaidClient.getAccounts(
    user.items[0].access_token,
    (err: Error, accountsRes: plaid.AccountsResponse) => {
      if (err) {
        res.json(err);
      }
      res.status(200).json(accountsRes);
    }
  );
});
