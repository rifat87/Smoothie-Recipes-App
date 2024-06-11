const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRoutes')
const cookieParser = require('cookie-parser') // this si a midddle ware so we ahve to use app.use
//acces the requireauth middleware for varify the user with jwt
const { requireAuth, checkUser } = require('./middleware/authMiddleware')


const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://netninja:auth123@cluster0.rntqeu5.mongodb.net/auth-node?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(dbURI).then((result) => app.listen(port, () => {console.log(`Started listenig ${port}`)})).catch((err) => console.log(err)) //models is for database
// routes
app.get('*', checkUser)
app.get('/', requireAuth, (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));

app.use(authRouter);

//cookies, and there is a third party pacage for cookies is called cookie-parser
// app.get('/set-cookies', (req, res) => {

//     // res.setHeader('Set-Cookie', 'newUser = true')
//     res.cookie('newUser', false)
//     res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true /*secure: ture here the secure means HTTPS req*/})

//     res.send('You got the cookies! ')
// })

// app.get('/read-cookies', (req, res) => {
//      const cookies = req.cookies 
//      console.log(cookies.newUser)
//      res.join(cookies)
// })

const port = process.env.PORT || 3500
