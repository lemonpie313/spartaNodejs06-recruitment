import express from 'express';
import errorHandler from './middlewares/error-handler.middleware.js';

const app = express();
const PORT = 3500;

app.use(express.json());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
