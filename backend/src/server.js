import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import router from './routes/index.js';
import connectDB from './config/database.js';

connectDB();

const app = express();

app.set('secretKey', process.env.SECRET_KEY);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running at port ${process.env.PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
    console.log(`Logged Error: ${err}`);
    server.close(() => process.exit(1));
});

app.use(express.static('public'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(router);
app.use('/api', router);
