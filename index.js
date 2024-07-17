require('dotenv').config();
const express = require('express');
const { connectMongoDB } = require('./models/connection');
const app = express();
const ejs = require('ejs');
const path = require('path');
const voterRouter = require('./Routes/voterRoutes');
const loginRouter = require('./Routes/loginRoutes');
const passwordChangeRouter = require('./Routes/passwordChangeRoute');
const logoutRouter = require('./Routes/logoutRoutes');
const candidateRouter = require('./Routes/candidateRoutes');
const votingRouter = require('./Routes/votingRoutes');
const voteCountRouter = require('./Routes/voteCountRoutes');
const cookieParser = require('cookie-parser');

// Connect Mongodb

connectMongoDB(process.env.DB_URL);

// Setting view engine

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'templates/views'))

// Middlewares

app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(cookieParser());

// Routes 

app.use('/voters',voterRouter);
app.use('/login',loginRouter);
app.use('/changepassword',passwordChangeRouter);
app.use('/logout',logoutRouter);
app.use('/candidate',candidateRouter);
app.use('/vote',votingRouter);
app.use('/countvote',voteCountRouter);


// Connecting Servers

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})