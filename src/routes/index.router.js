import express from 'express';
import authRouter from './auth.router.js';
import resumesRouter from './resumes.router.js';
import usersRouter from './users.router.js';

const apiRouter = express.Router();

apiRouter.use('/resumes', resumesRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/user', usersRouter);

export default apiRouter;
