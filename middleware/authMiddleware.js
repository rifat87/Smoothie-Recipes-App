// this is for the check if the jwt token is available and valid or not and then send the user to the next page other wise redirect to login page

const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt

    // chec json wev token exitst & is verified
    if(token){
        // we are going to use jwt.verify method to check the token
        jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
            if(err) { // if there is any error found then redirect the user to login page
                console.log(err.message)
                res.redirect('/login')
            }else{
                console.log(decodedToken)
                next()
            }
        } )
    }
    else{
        res.redirect('/login')
    }
}

//check current user, next page is requested then we are going to check if it is from the old use or new user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, 'net ninja secret', async(err, decodedToken) => {
            if(err) { // if there is any error found then redirect the user to login page
                console.log(err.message)
                res.locals.user = null
            }else{
                console.log(decodedToken)//here in decodedToken we have payload and in the payload we have the use id
        
                let user = await User.findById(decodedToken.id)
                res.locals.user = user;
                next()
            }
        } )
    }else{
        res.locals.user = null
        next()
    }
}


module.exports = { requireAuth, checkUser }
