import jwtAuthz from 'express-jwt-authz';

// Example. check<scope>Scope 
export const checkScope = jwtAuthz([/* scope string goes here */])