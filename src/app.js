import express from 'express';
import dotEnv from 'dotenv';
import apiRouter from './routes/index.router.js';
import errorHandler from './middlewares/error-handler.middleware.js';

dotEnv.config();

const app = express();
const PORT = 3500;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('루트!!');
});

app.use('/api', apiRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
