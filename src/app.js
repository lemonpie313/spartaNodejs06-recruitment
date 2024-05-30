import express from 'express';
import dotEnv from 'dotenv';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/error-handler.middleware.js';
import userRouter from './routes/auth.router.js';
import resumeRouter from './routes/resumes.router.js';
import recruiterRouter from './routes/recruiter.router.js';

dotEnv.config();

const app = express();
const PORT = 3500;

app.use(express.json());
app.use(cookieParser());

app.use('/api', [userRouter, resumeRouter, recruiterRouter]);

app.get('/', (req, res) => {
  res.send('루트!!');
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
