import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import auth from '../config/auth.config';

// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
export const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: auth.jwksUri,
  }),
  // Validate the audience and the issuer.
  audience: auth.audience,
  issuer: auth.issuer,
  algorithms: ['RS256'],
});
