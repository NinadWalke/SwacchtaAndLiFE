if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// --- Imports ---
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");

// --- Utils ---
const ExpressError = require("./utils/ExpressError.js");

// -- Routers --
const authRouter = require('./routes/authRouter.js');
const profileRouter = require('./routes/profileRouter.js');
const reportsRouter = require("./routes/reportsRouter.js");
const eventsRouter = require('./routes/eventsRouter.js');
const committeeRouter = require('./routes/committeeRouter.js');
const shopRouter = require('./routes/shopRouter.js');
const ospRouter = require('./routes/ospRouter.js');
const trainingRouter = require('./routes/trainingRouter.js');
const recycleRouter = require('./routes/recycleRouter.js');
const officialRouter = require('./routes/officialRouter.js');
const wasteSubmissionRouter = require('./routes/wasteSubmissionRouter.js');

// --- Models ---
const User = require("./schemas/User.js");

// -- ENV Requirements --
const SESSION_SECRET = process.env.SESSION_SECRET || "your_session_secret_here";

// --- Server settings ---
// Express setup
const port = process.env.PORT;
const app = express();

// MongoDB setup
const dbURI =
  process.env.NODE_ENV === "production"
    ? process.env.CLOUD_DB_URI
    : process.env.DB_URI;

main()
  .then(() => {
    console.log("Connection to MongoDB successful!");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB. Error: " + err.message);
  });

async function main() {
  await mongoose.connect(dbURI);
}

// Store code
const store = MongoStore.create({
  mongoUrl: dbURI,
  touchAfter: 24 * 3600, // Interval (in seconds) between session updates    (Update information after 23 hours)
});
store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

// Session Setup
// Session Code
const sessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // Cookie options below
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Current time * No of days * no of hours in one day * no of minutes in an hour * no of seconds in a min * no of milliseconds in a second
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // For security purposes => Cross scripting attacks are prevented at this step
  },
  store: store,
};

//Server setup
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.PROD_LINK_REACT
        : process.env.DEV_LINK_REACT,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
// Google strategy here
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// --- Routes ---
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/reports', reportsRouter);
app.use('/events', eventsRouter);
app.use('/committees', committeeRouter);
app.use('/shop', shopRouter);
app.use('/osp', ospRouter);
app.use('/training', trainingRouter);
app.use('/recycle', recycleRouter);
app.use('/official', officialRouter);
app.use('/waste-submission', wasteSubmissionRouter);

// x. Default Route
app.get("/", async (req, res) => {
  console.log(`Backend active!`);
});

// -- Error handling routes --
app.use((req, res, next) => {
  next(new ExpressError(404, "API not found!"));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
