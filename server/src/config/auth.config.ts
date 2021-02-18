require('dotenv').config();

export default {
  audience: process.env.AUTH_AUDIENCE ?? '',
  issuer: process.env.AUTH_ISSUER ?? '',
  jwksUri: process.env.AUTH_JWKS_URI ?? '',
};
