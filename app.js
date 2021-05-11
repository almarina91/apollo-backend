const express = require('express');
const app = express();

const userRouter = require('./src/routers/user');
const planRouter = require('./src/routers/plan');
const dayRouter = require('./src/routers/day');
const intervalRouter = require('./src/routers/interval');

require('./src/db/mongoose');
app.use(express.json())

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Access-Control-Allow-Headers', 'Authorization');
    next();
});

app.use(userRouter);
app.use(planRouter);
app.use(dayRouter);
app.use(intervalRouter);

module.exports = app;