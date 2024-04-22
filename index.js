const express = require('express')
require('dotenv').config();
const urlError = require("./Middlewares/url-error-handling")
const rateLimit = require("express-rate-limit");

const bodyParser = require('body-parser')
const app = express();
app.use(express.json());

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });

const router = require("./Routes/routes");
const auth = require('./Middlewares/auth');
//app.use('/api',auth)
app.use(limiter)
app.use('/api',router)

app.use(urlError);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



