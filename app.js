const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

var app = express()

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsRouter = require('./server/routes/cors')
const discsRoutes = require('./server/routes/disc');
const collectionsRoutes = require('./server/routes/collection')
const collectionDiscsRoutes = require('./server/routes/collectionDisc')

app.use(corsRouter)
// app.use('/bypass', bypassRoutes)

// app.use('/users', auth.isAuthenticated, usersRoutes)
app.use('/discs', discsRoutes)
app.use('/collections', collectionsRoutes)
app.use('/collectionDiscs', collectionDiscsRoutes)

app.get('/', (req, res) => res.status(200).send({
  message: 'Servidor client em pé!',
}));

app.get('*', (req, res) => res.status(200).send({
  message: 'Rota não encontrada, você digitou certo?',
}));

module.exports = app;
