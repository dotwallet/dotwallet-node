const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const path = require('path');
const app = express();
const cors = require('cors');
var ip = require('ip');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { swaggerOptions } = require('./config');
const { routes } = require('./routes/index.js');

const PORT = process.env.PORT || 3000;
const appUrl = 'http://' + ip.address() + ':' + PORT;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('src'));

// static pages
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});
app.get('/log-in-redirect', async (req, res) => {
  // client-side page to receive the code after user confirms login. Could be done on the same login page, but separated here to show steps
  res.sendFile(path.join(__dirname + '/views/log-in-redirect.html'));
});
app.get('/logged-in', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/logged-in.html'));
});
app.get('/store-front', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/store-front.html'));
});

app.get('/ping', (req, res) => res.json({ message: 'pong!' }));

// API docs
const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
// console.log({ specs });

routes(app);

module.exports = { app };

if (process.env.TEST !== 'true')
  app.listen(PORT, () =>
    console.log(
      `DotWallet example app listening at ${process.env.NODE_ENV === 'production' ? 'production host' : appUrl}\n
      API docs available at ${process.env.NODE_ENV === 'production' ? 'production host' : appUrl}/docs`,
    ),
  );
