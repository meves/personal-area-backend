import express, { Request, Response, NextFunction } from 'express';
import createError, { HttpError }  from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import indexRouter from './routes/index';
import sequelize from './db';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/** static server process GET Home Page in production mode */
if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, '../../client/build/')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../../client/build/index.html'));
  })
}
/** all requests to /api processed by indexRouter */
app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const start = async() => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection to database has been established successfully.');
  } 
  catch (error) {
    console.log(`Unable to connect to the database: ${error}`);
  }
}

start();

module.exports =  app;
