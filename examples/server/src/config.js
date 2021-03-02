const CLIENT_ID = '89d001043806644fdb4fb14099ff6be5';
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'DotWallet MicroService',
      version: '1.0.0',
      description: 'A server for using DotWallets APIs',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  // List of files to be processed. You can also set globs './routes/*.js'
  apis: [__dirname + '/routes/*.js'],
};

module.exports = { swaggerOptions, CLIENT_ID, CLIENT_SECRET };
