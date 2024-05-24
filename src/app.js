import express from 'express';
import dotEnv from 'dotenv';

const app = express();
const PORT = 3500;

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
