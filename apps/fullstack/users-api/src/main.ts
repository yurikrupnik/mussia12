import express from 'express';

const app = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome!' });
});

app.get('/api/users', (req, res) => {
  res.send({ message: 'Welcome to users-api!' });
});

console.log('process.env.port', process.env.port);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);