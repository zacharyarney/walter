import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { checkJwt } from '../middleware/checkJwt';
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
