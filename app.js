import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import promotionRoutes from './routes/promotion.js';
import categoryRoutes from './routes/category.js';
import payRoutes from './routes/pay.js';
import deliveryRoutes from './routes/delivery.js';

const app = express();
const port = process.env.PORT || 3000; // Define el puerto (por defecto 3000)
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
// View engine setup
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/promotions', promotionRoutes);
app.use('/categories', categoryRoutes);
app.use('/payments', payRoutes);
app.use('/deliveries', deliveryRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
