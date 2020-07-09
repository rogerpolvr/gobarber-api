import 'reflect-metadata';
import express from 'express';
import routes from './routes';
import './database';

const app = express();

app.use(express.json());
app.use(routes);

app.post('/users', (request, response) => {
  const { name, email } = request.body;

  const user = {
    name,
    email,
  };

  return response.json(user);
});

app.listen(3333, () => {
  console.log('\x1b[5m\x1b[33m%s\x1b[0m\x1b[1m', '🚀 Server started on localhost port 3333! 🚀', '\x1b[0m');
});
