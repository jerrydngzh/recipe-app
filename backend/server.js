const express = require('express');
const path = require("path")
const db = require("./models/db")
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;

var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors")
const corsOps = {
  origin: "*",
  optionSuccessStatus: 200,
  credentials: true,
}


// var indexRouter = require('./routes/index');
var recipesApiRouter = require('./routes/recipeApi');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', express.static(path.join(__dirname, '/fe-static-build')))

// setup middleware to use
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOps));

// app.use('/', indexRouter);
app.get("/healthcheck", (req, res) => {
  res.send("healthcheck recipes api")
});

app.use('/api', recipesApiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// start up the server to listen for requests
db.helpers.setup_tables()
.then(
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  })
)

