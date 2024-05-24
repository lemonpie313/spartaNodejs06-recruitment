import express from 'express';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/error-handler.middleware.js';
import userRouter from './routes/users.router.js';

const app = express();
const PORT = 3500;

app.use(express.json());
app.use(cookieParser());

app.use('/auth', [userRouter]);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
