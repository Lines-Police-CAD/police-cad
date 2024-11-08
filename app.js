// Load environment variables file into process.
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");
const http = require("http").createServer(express);
const realFs = require("fs");
const gracefulFs = require("graceful-fs");
const rateLimit = require("express-rate-limit");

// Environment variables
const newBaseURL = process.env.NEW_BASE_URL || "http://localhost:8080";
const redirectStatus = parseInt(process.env.REDIRECT_STATUS || 302);
const oldBaseURL = process.env.OLD_BASE_URL;
const dbUri = process.env.DB_URI || "mongodb://localhost/knoldus";
const port = process.env.PORT || 8080;

// Initialize express app
const app = express();

// Graceful-fs: delay on EMFILE errors from any fs-using dependencies
gracefulFs.gracefulify(realFs);

// Connect to MongoDB database
mongoose.connect(dbUri);
mongoose.set("useFindAndModify", false);

// Setup passport
require("./config/passport")(passport);

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.set("trust proxy", 1);

// Rate limiter
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // limit each IP to 500 requests per windowMs
});
app.use(limiter);

// Middleware setup
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ uploadDir: "/images" }));

// Set the view engine to ejs
app.set("view engine", "ejs");

// Setup session storage
app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: "knoldus",
    resave: false,
    saveUninitialized: true,
    cookie: {
      path: "/",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Use the flash
app.use(flash());

// Static serving of public files
app.use("/static", express.static(path.join(__dirname, "public")));

// Force live domain
app.use(function forceLiveDomain(req, res, next) {
  const host = req.get("Host");
  if (host === oldBaseURL) {
    return res.redirect(redirectStatus, newBaseURL + req.originalUrl);
  }
  return next();
});

// HTTP server for the express application
const server = app.listen(port, function () {
  console.log("Server started.", server.address());
});

// Setup routes
require("./app/routes")(app, passport, server);
