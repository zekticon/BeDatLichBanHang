import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
import cors from 'cors';
import cookieParser from 'cookie-parser';
require('dotenv').config();

let app = express();

//config app

app.use(
    cors({
        credentials: true,
        origin: (_, callback) => callback(null, true),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        optionsSuccessStatus: 200,
    }),
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;

app.listen(port, () => {
    console.log('Backend Nodejs is running on the port : ' + port);
});
