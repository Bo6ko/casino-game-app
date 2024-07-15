import express from 'express';
import bodyParser from 'body-parser';
import gameLogicRoute from './api/routes/gameLogic.js';
import walletRoute from './api/routes/wallet.js';

const app = express();

app.use(bodyParser.json());

app.use('/', gameLogicRoute);
app.use('/wallet', walletRoute);

app.post('/test', (req, res) => {
    res.send({})
});

export default app;
