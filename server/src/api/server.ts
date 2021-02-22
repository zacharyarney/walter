import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { checkJwt } from '../middleware/checkJwt';
import * as users from './dao/users/users';

export const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Hello, world!',
  });
});

app.get('/private', checkJwt, (req, res) => {
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