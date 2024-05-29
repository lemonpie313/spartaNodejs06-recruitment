import express from 'express';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/error-handler.middleware.js';
import userRouter from './routes/users.router.js';
import resumeRouter from './routes/resume.router.js';
import recruiterRouter from './routes/recruiter.router.js';
import tokenRouter from './routes/token.router.js';
const app = express();
const PORT = 3500;

app.use(express.json());
app.use(cookieParser());

app.use('/api', [userRouter, resumeRouter, recruiterRouter, tokenRouter]);

app.get('/', (req, res) => {
  res.send('루트!!');
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
