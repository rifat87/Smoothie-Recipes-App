//importing user model
const User = require('../models/User')
//accessing json web token
const jwt = require('jsonwebtoken')

// handle errors , directly print koraile onek kisu show kore ar evabe dile jason akare pass hoy and just main message tuku pass hoy jeta amra database condition set kore disilam
const handleErrors = (err) => {
    console.log(err.message, err.code)
    // so we are going to do find out the email error and password the send individual error message
    let errors = { email: '', password: ''}

    //email incorrect in login form
    if(err.message === 'incorrect email') {
        errors.email =  'that email is not registered'
    }
    //psss incorrect in login form
    if(err.message === 'incorrect password') {
        errors.password =  'that password is incorrect'
    }

    //duplicate error code
    if(err.code === 11000) {
        errors.email = 'that email is already registered'
        return errors;
    }

    //validatior erros
    if(err.message.includes('user validation failed')){
        // Object.values(err.errors).forEach(error => {
        //     console.log(error.properties)
        // })

        //it does exactly same thing
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    return errors
}

//jwt funcition
const maxAge = 3*24*60*60
const createToken = (id) => { // here the id is, in mongoDB we have and id propertie , and this is that one, here id is the payload, second argument is the secret and the trhird one is the option which is the validation and how log the token will validate
    return jwt.sign({ id }, 'net ninja secret', {
        expiresIn: maxAge//this stores in second not like cookies in mili
    })

}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}
module.exports.login_get = (req, res) => {
    res.render('login');
}
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body

    try{
        const user = await User.create({ email, password}) //taking user email id and password as input
        //creating the token
        const token = createToken(user._id) 
        // so now we are goign to save this inside a cookie and send it as a part of the  response

        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000})
        res.status(201).json({ user: user._id})
    }catch(err){
        const errors = handleErrors(err)
        // res.status(400).send('error, user not created')
        res.status(400).json({ errors })
    }
}

//user login
module.exports.login_post = async(req, res) => {
    const { email, password } = req.body
    // console.log(email)
    try{
        const user = await User.login(email, password)//chekig the email and pass to varify the user , we will send this data to User.js and check the data using the login method
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000})
        res.status(200).json({ user: user._id})
    }catch(err){
        //sending error for wrong information
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// logout module
module.exports.logout_get = (req, res) => {
    //we cannot delete the the JWT token , so what can we is replase the token with empty and shorter time duration which will be removed automatically
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}
