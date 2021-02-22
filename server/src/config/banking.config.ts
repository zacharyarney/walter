require('dotenv').config();

export default {
  clientId: process.env.PLAID_CLIENT_ID ?? '',
  sandboxSecret: process.env.PLAID_SANDBOX_SECRET ?? '',
  devSecret: process.env.PLAID_DEV_SECRET ?? '',
};
