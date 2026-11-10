const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');

dotenv.config();
require('./Models/db');

const app = express();

const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});