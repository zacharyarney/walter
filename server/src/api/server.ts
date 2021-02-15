import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

export const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});
