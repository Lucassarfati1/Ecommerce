import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import promotionRoutes from './routes/promotion.js';
import categoryRoutes from './routes/category.js';
import payRoutes from './routes/pay.js';
import productRoutes from './routes/product.js';
import deliveryRoutes from './routes/delivery.js';
import orderRoutes from './routes/order.js';

const app = express();

// View engine setup
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'jade');

// Middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/order', orderRoutes);
app.use('/promotions', promotionRoutes);
app.use('/products', productRoutes);
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

  // En lugar de renderizar, enviar JSON para APIs
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/users') || req.originalUrl.startsWith('/products')) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      error: req.app.get('env') === 'development' ? err.stack : 'Internal Server Error'
    });
  }

  // Render the error page para rutas web
  res.status(err.status || 500);
  res.render('error');
});

// Start server - ESTO VA AL FINAL
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

export default app;