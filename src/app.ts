import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

const app = express();

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.post('/', (req, res) => {
  const { name } = req.body;
  res.send(`Welcome ${name}`);
});

app.get('/', (req, res) => {
  res.status(200);
  res.send('Welcome to root URL of Server');
});

app.get('/hello', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200).send('<h1>Hello GFG Learner!</h1>');
});

app.get('/file', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/cat.webp'));
});

export default app;
