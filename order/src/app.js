const express = require('express');
const { Database }= require('arangojs');
const orderApi = require('./order-api');
const ordersApi = require('./orders-api');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/openapi.json');
const http = require('http');


const app = express();
app.use(express.json()); //adds support for json encoded bodies
app.use(express.urlencoded({ extended: true })); //adds support url encoded bodies
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const db = new Database({
    url: 'http://10.20.110.66:8529',
    databaseName: 'Order'
});
const orders = db.collection('orders');
app.set('db', db);
app.set('collection', 'orders');

app.use('/api', orderApi, ordersApi);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const httpServer = http.createServer(app);
httpServer.listen(5001, () => {
    console.log('server started! listening on http://localhost:5001');
    console.log('api documentation available on http://localhost:5001/api-docs');
});