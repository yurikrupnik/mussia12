import express from 'express';
import bodyParser from 'body-parser';
import db from './app/services/db';
import api from './app/api/users';

const app = express();

app.use(
  express.json(),
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome!' });
});

app.use(db(process.env.MONGO_URI || 'mongodb://localhost/mussia12'));
app.use('/api', api);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
