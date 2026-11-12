const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('node:path');
const AuthRouter = require('./Routes/AuthRouter');
const { connectDatabase, requireDatabase } = require('./Models/db');

dotenv.config({ path: path.join(__dirname, '.env') });
connectDatabase();

const app = express();

const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', requireDatabase, AuthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
